import * as ActionTypes from './types';
import api from '../api';
import { sendMessage } from './messages';

export const fetchRooms = () => (dispatch) => {
  api.getRooms()
    .then(rooms => dispatch({ type: ActionTypes.FETCH_ROOMS_SUCCESS, payload: rooms }))
    .catch(error => dispatch({ type: ActionTypes.FETCH_ROOMS_ERROR, payload: error }));
};

export const leaveRoom = roomId => (
  async (dispatch, getState) => {
    const { currentUser, rooms } = getState();
    const room = rooms.byId[roomId];
    if (room.users.length !== 1) {
      dispatch(sendMessage(roomId, `Пользователь ${currentUser.data.name} покинул комнату`));
    }

    try {
      const updatesRoom = await api.currentUserLeaveRoom(roomId);

      dispatch({ type: ActionTypes.CURRENT_USER_LEAVE_ROOM, payload: updatesRoom });
    } catch (e) {
      dispatch({
        type: ActionTypes.CURRENT_USER_LEAVE_ROOM_ERROR,
      });
    }
  }
);

export const userLeavedRoom = ({ roomId, userId }) => (
  (dispatch, getState) => {
    const { rooms } = getState();
    const room = {
      ...rooms.byId[roomId],
      users: rooms.byId[roomId].users.filter(id => id !== userId),
    };
    dispatch({ type: ActionTypes.USER_LEAVE_ROOM, payload: room });
  }
);

export const fetchRoom = roomId => (
  async (dispatch) => {
    dispatch({
      type: ActionTypes.FETCH_ROOM_START,
    });

    try {
      const payload = await api.getRoom(roomId);

      dispatch({
        type: ActionTypes.FETCH_ROOM_SUCCESS,
        payload,
      });
    } catch (e) {
      dispatch({
        type: ActionTypes.FETCH_ROOM_ERROR,
        payload: e.message,
      });
    } finally {
      dispatch({
        type: ActionTypes.FETCH_ROOM_END,
      });
    }
  }
);

export const openRoom = roomId => (
  (dispatch, getState) => {
    const { rooms } = getState();
    const room = rooms.byId[roomId];

    if (!room) { dispatch(fetchRoom(roomId)); }
  }
);
