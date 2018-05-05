import * as ActionTypes from './types';
import api from '../api';

export const fetchRooms = () => (dispatch) => {
  api.getRooms()
    .then(rooms => dispatch({ type: ActionTypes.FETCH_ROOMS_SUCCESS, payload: rooms }));
};

export const leaveRoom = roomId => (dispatch) => {
  api.currentUserLeaveRoom(roomId)
    .then(room => dispatch({ type: ActionTypes.CURRENT_USER_LEAVE_ROOM, payload: room }));
};

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

export const markAllUnreadMessages = roomId => (
  async () => {
    await api.markAllUnreadMessages(roomId);
  }
);

export const openRoom = roomId => (
  (dispatch, getState) => {
    const { rooms } = getState();
    const room = rooms.byId[roomId];

    if (!room) { dispatch(fetchRoom(roomId)); }
    dispatch(markAllUnreadMessages(roomId));
  }
);
