const { findUserBySid, getUsers, saveUser } = require('./database/user');
const {
  joinRoom, leaveRoom, getUserRooms, createRoom,
} = require('./database/room');
const { getMessages, sendMessage } = require('./database/messages');
const TYPES = require('./messages');

/**
 * @param {Db} db
 * @param {*} io
 */
// eslint-disable-next-line func-names
module.exports = function (db, io) {
  const ONLINE = {};

  /**
     * @param {Pagination<User>} users
     * @return {Pagination<User>}
     */
  function fillUsersWithStatus(users) {
    // eslint-disable-next-line no-param-reassign

    return {
      ...users,
      items: users.items.map(user => ({ ...user, online: Boolean(ONLINE[user._id]) })),
    };
  }

  /**
     * Connection is created
     */
  io.on('connection', (socket) => {
    const { sid } = socket.request.cookies;
    let isDisconnected = false;

    socket.join('broadcast');

    /**
         * Invoke callback and handle errors
         *
         * @param callback
         */
    function wrapCallback(callback) {
      // eslint-disable-next-line func-names
      return function (...args) {
        const printErr = (err) => {
          // eslint-disable-next-line no-console
          console.error(err);

          socket.emit(TYPES.ERROR, {
            message: err.message,
            stack: err.stack,
          });
        };

        try {
          callback(...args).catch(printErr);
        } catch (err) {
          printErr(err);
        }
      };
    }

    /**
         * Send notification to every user about status change
         *
         * @param {string} userId
         */
    function userChangeOnlineStatus(userId) {
      socket.broadcast.emit(TYPES.ONLINE, {
        status: ONLINE[userId],
        userId,
      });
    }

    /**
         * Join to socket channel, to broadcast messages inside Room
         *
         * @param {string} roomId
         */
    // eslint-disable-next-line no-empty-pattern
    function joinToRoomChannel({}, roomId) {
      socket.join(`room:${roomId}`);
    }

    /**
         * Leave socket channel
         *
         * @param {string} roomId
         */
    function leaveRoomChannel(roomId) {
      socket.leave(`room:${roomId}`);
    }

    /**
         * Broadcast messages inside Room about user joined
         *
         * @param {string} userId
         * @param {string} roomId
         */
    function userWasJoinedToRoom({ userId, roomId }) {
      socket.to(`room:${roomId}`).emit(TYPES.USER_JOINED, { userId, roomId });
    }

    /**
         * Broadcast messages inside Room about user leave
         *
         * @param {string} userId
         * @param {string} roomId
         */
    function userLeaveRoom({ userId, roomId }) {
      socket.to(`room:${roomId}`).emit(TYPES.USER_LEAVED, { userId, roomId });
    }

    /**
         * New message coming to room
         *
         * @param {Message} message
         */
    function newMessage(message) {
      socket.to(`room:${message.roomId}`).emit(TYPES.MESSAGE, message);
    }

    // Load user information for next usage
    const userPromise = findUserBySid(db, sid).catch((error) => {
      throw new Error(`Cannot load user: ${error}`);
    });

    // Receive current user information
    socket.on(TYPES.CURRENT_USER, wrapCallback(async () => {
      socket.emit(TYPES.CURRENT_USER, await userPromise);
    }));

    // Update user information
    socket.on(TYPES.UPDATE_USER, wrapCallback(async (params) => {
      socket.emit(TYPES.UPDATE_USER, await saveUser(db, params));
    }));

    // Return list of all users with
    socket.on(TYPES.USERS, wrapCallback(async (params) => {
      socket.emit(TYPES.USERS, fillUsersWithStatus(await getUsers(db, params || {})));
    }));

    // Create room
    socket.on(TYPES.CREATE_ROOM, wrapCallback(async (params) => {
      const currentUser = await userPromise;

      socket.emit(TYPES.CREATE_ROOM, await createRoom(db, currentUser, params));
    }));

    // Rooms of current user
    socket.on(TYPES.CURRENT_USER_ROOMS, wrapCallback(async () => {
      const currentUser = await userPromise;

      socket.emit(TYPES.CURRENT_USER_ROOMS, await getUserRooms(db, currentUser));
    }));

    // Join current user to room
    socket.on(TYPES.CURRENT_USER_JOIN_ROOM, wrapCallback(async ({ roomId }) => {
      const currentUser = await userPromise;

      const payload = {
        roomId,
        userId: currentUser._id,
      };

      socket.emit(TYPES.CURRENT_USER_JOIN_ROOM, await joinRoom(db, currentUser, payload));

      joinToRoomChannel(roomId);
      userWasJoinedToRoom(payload);
    }));

    // Join user to room
    socket.on(TYPES.USER_JOIN_ROOM, wrapCallback(async (payload) => {
      const currentUser = await userPromise;
      socket.emit(TYPES.USER_JOIN_ROOM, await joinRoom(db, currentUser, payload));

      joinToRoomChannel(payload.roomId);
      userWasJoinedToRoom(payload);
    }));

    // Leave current user to room
    socket.on(TYPES.CURRENT_USER_LEAVE_ROOM, wrapCallback(async ({ roomId }) => {
      const currentUser = await userPromise;

      const payload = {
        roomId,
        userId: currentUser._id,
      };

      socket.emit(TYPES.CURRENT_USER_LEAVE_ROOM, await leaveRoom(db, currentUser, payload));

      leaveRoomChannel(roomId);
      userLeaveRoom(payload);
    }));

    // Send message
    socket.on(TYPES.SEND_MESSAGE, wrapCallback(async (payload) => {
      const currentUser = await userPromise;

      const message = await sendMessage(db, {
        ...payload,
        userId: currentUser._id,
      });

      socket.emit(TYPES.SEND_MESSAGE, message);

      newMessage(message);
    }));

    // Send message
    socket.on(TYPES.MESSAGES, wrapCallback(async (payload) => {
      socket.emit(TYPES.MESSAGES, await getMessages(db, payload));
    }));

    userPromise.then(async (user) => {
      if (!isDisconnected) {
        ONLINE[user._id] = true;
      }

      userChangeOnlineStatus(user._id);

      // Get of user groups
      const rooms = await getUserRooms(db, user);
      rooms.items.forEach((room) => {
        joinToRoomChannel(db, room._id);
      });
    });

    socket.on('disconnect', async () => {
      isDisconnected = true;
      const user = await userPromise;

      ONLINE[user._id] = false;

      userChangeOnlineStatus(user._id);
    });
  });
};
