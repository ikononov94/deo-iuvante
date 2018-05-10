import * as ActionTypes from './types';
import api from '../api';

export const fetchMessages = roomId => (
  async (dispatch) => {
    dispatch({
      type: ActionTypes.FETCH_MESSAGES_START,
    });

    try {
      // const state = getState();
      // const offset = state.rooms.byId[roomId].messages.length - 1;

      const payload = await api.getMessages({ roomId, limit: 500 });

      dispatch({
        type: ActionTypes.FETCH_MESSAGES_SUCCESS,
        payload: {
          roomId,
          messages: payload,
        },
      });
    } catch (e) {
      dispatch({
        type: ActionTypes.FETCH_MESSAGES_FAILURE,
        payload: e.message,
      });
    } finally {
      dispatch({
        type: ActionTypes.FETCH_MESSAGES_END,
      });
    }
  }
);

export const addMessage = message => (
  (dispatch, getState) => {
    let payload = {};
    const { rooms, currentUser } = getState();
    const room = rooms.byId[message.roomId];
    if (room.users.length === 1) {
      payload = {
        ...message,
        attachments: {
          [currentUser.data._id]: {
            read: true,
          },
        },
      };
    } else payload = message;

    dispatch({
      type: ActionTypes.ADD_MESSAGE,
      payload,
    });
  });

export const sendMessage = (roomId, message) => (
  async (dispatch) => {
    const payload = await api.sendMessage({ roomId, text: message });

    dispatch(addMessage(payload));
  }
);

export const readMessages = roomId => (
  (dispatch, getState) => {
    const { rooms } = getState();
    const room = rooms.byId[roomId];

    dispatch({
      type: ActionTypes.READ_MESSAGES,
      payload: room.messages,
    });
  }
);
