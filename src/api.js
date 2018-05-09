import io from 'socket.io-client';
import * as MESSAGES from './server/messages';

class Api {
  constructor() {
    this._connectPromise = fetch('/api/auth', { credentials: 'same-origin' })
      .then(() => this._setupSocket())
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error(`Auth problems: ${err.message}`);

        throw err;
      });
    this.queues = {};
  }

  /**
     * Await for connection
     *
     * @return {Promise<*>}
     */
  _setupSocket() {
    this.io = io();

    return new Promise((resolve) => {
      this.io.on('connect', resolve);
    });
  }

  /**
     * Request data and wait response
     *
     * @param {string} type message type from MESSAGES
     * @param {*} [payload] any requested data
     *
     * @return {Promise<*>}
     * @private
     */
  async _requestResponse(type, payload) {
    await this._connectPromise;

    const requestId = Math.random();

    const resolver = (resolve) => {
      this.io.on(type, (data) => {
        if (data.requestId === requestId) resolve(data.payload);
      });
    };

    this.io.emit(type, { requestId, payload });
    return new Promise(resolver)
      .then((data) => {
        this.io.off(type, resolver);
        return data;
      });
  }

  /**
     * Return current user information
     *
     * @return {Promise<User>}
     */
  async getCurrentUser() {
    return this._requestResponse(MESSAGES.CURRENT_USER);
  }

  /**
     * Return all known users
     *
     * @param {{ [limit]: number, [_id]: string }} [filter] - you can pass next object here
     *
     * @return {Promise<Pagination<User>>}
     */
  async getUsers(filter) {
    return this._requestResponse(MESSAGES.USERS, filter);
  }

  /**
     * Get information about user
     *
     * @param {string} userId
     * @return {Promise<User>}
     */
  async getUser(userId) {
    const userArray = await this.getUsers({ _id: [userId] });

    return userArray[0];
  }

  /**
     * Update user
     *
     * @param {User} user
     *
     * @returns {Promise<void>}
     */
  async updateUser(user) {
    return this._requestResponse(MESSAGES.UPDATE_USER, user)
      .then((userResult) => {
        if (userResult.error) {
          throw new Error(userResult.error);
        }

        return userResult;
      });
  }

  /**
     * @param {Room} room
     *
     * @return {Promise<void>}
     */
  async createRoom(room) {
    return this._requestResponse(MESSAGES.CREATE_ROOM, room)
      .then(async (roomResult) => {
        if (roomResult.error) {
          throw new Error(roomResult.error);
        }

        return roomResult;
      });
  }

  /**
     * Return room by id
     *
     * @param {string} roomId
     *
     * @return {Promise<Room>}
     */
  async getRoom(roomId) {
    const allRooms = await this.getRooms();

    return allRooms.filter(room => room._id === roomId)[0];
  }

  /**
     * Return list of rooms for current user
     *
     * @param {{ limit: number }} [filter]
     *
     * @return {Promise<Pagination<Room>>}
     */
  async getRooms() {
    return this._requestResponse(MESSAGES.CURRENT_USER_ROOMS);
  }

  /**
     * Join current user to the room
     *
     * @param {string} userId
     * @param {string} roomId
     *
     * @return {Promise<Room>}
     */
  async userJoinRoom(roomId) {
    return this._requestResponse(MESSAGES.CURRENT_USER_JOIN_ROOM, { roomId });
  }

  /**
     * Current user leave the room
     *
     * @param {string} roomId
     *
     * @return {Promise<Room>}
     */
  async currentUserLeaveRoom(roomId) {
    return this._requestResponse(MESSAGES.CURRENT_USER_LEAVE_ROOM, { roomId });
  }

  /**
     * Send message to the room
     *
     * @param {string} message
     *
     * @return {Promise<Message>}
     */
  async sendMessage(message) {
    return this._requestResponse(MESSAGES.SEND_MESSAGE, message);
  }

  /**
   * Mark message as read
   *
   * @param {string} messageId
   *
   * @return object
   */
  async markMessageAsRead(messageId) {
    return this._requestResponse(MESSAGES.MARK_AS_READ, messageId);
  }

  /**
   * Mark all unread messages in a Room as read;
   *
   * @param {string} roomId
   *
   * @return {Promise<>}
   */
  async markAllUnreadMessages(roomId) {
    return this._requestResponse(MESSAGES.MARK_ALL_UNREAD, roomId);
  }

  /**
     * Return list of messages
     *
     * @param {{}} [filter]
     *
     * @return {Promise<Pagination<Message>>}
     */
  async getMessages(filter) {
    return this._requestResponse(MESSAGES.MESSAGES, filter);
  }

  /**
     * Invoke callback, when someone change his status
     *
     * @param {function({userId: string, status: boolean})} callback
     *
     * @return Promise<void>
     */
  async onUserChangeStatus(callback) {
    await this._connectPromise;

    this.io.on(MESSAGES.ONLINE, callback);
  }

  /**
     * Invoke callback, when someone joined one of your rooms
     *
     * @param {function({userId: string, roomId: string})} callback
     *
     * @return Promise<void>
     */
  async onUserJoinedRoom(callback) {
    await this._connectPromise;

    this.io.on(MESSAGES.USER_JOINED, callback);
  }

  /**
     * Invoke callback, when someone leaved one of your rooms
     *
     * @param {function({userId: string, roomId: string})} callback
     *
     * @return Promise<void>
     */
  async onUserLeavedRoom(callback) {
    await this._connectPromise;

    this.io.on(MESSAGES.USER_LEAVED, callback);
  }

  /**
     * Invoke callback, when someone joined one of your rooms
     *
     * @param {function(Message)} callback
     *
     * @return Promise<void>
     */
  async onMessage(callback) {
    await this._connectPromise;

    this.io.on(MESSAGES.MESSAGE, callback);
  }


  offMessage() {
    this.io.off(MESSAGES.MESSAGE);
  }

  async onMessageRead(callback) {
    await this._connectPromise;

    this.io.on(MESSAGES.MARK_AS_READ, callback);
  }


  async onMessagesRead(callback) {
    await this._connectPromise;

    this.io.on(MESSAGES.MARK_ALL_UNREAD, callback);
  }

  offMessagesRead() {
    this.io.off(MESSAGES.MARK_ALL_UNREAD);
  }

  async onNewRoom(callback) {
    await this._connectPromise;

    this.io.on(MESSAGES.NEW_ROOM, callback);
  }

  async onUpdateUser(callback) {
    await this._connectPromise;

    this.io.on(MESSAGES.NEW_USER, callback);
  }
}


export default window.api = new Api();
