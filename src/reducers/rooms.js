import * as types from '../actions/types';

export const mapRoom = room => ({ ...room, messages: room.messages.map(message => message._id) });

const rooms = (
  state = {
    byId: {},
    allIds: [],
  },
  action,
) => {
  switch (action.type) {
    case types.FETCH_ROOMS_SUCCESS: {
      const byId = {},
        allIds = [];
      action.payload.forEach((room) => {
        allIds.push(room._id);
        byId[room._id] = mapRoom(room);
      });
      return ({
        ...state,
        allIds,
        byId: { ...state.byId, ...byId },
      });
    }
    case types.FETCH_ROOM_SUCCESS: {
      return ({
        ...state,
        allIds: [...state.allIds, action.payload._id],
        byId: { ...state.byId, [action.payload._id]: mapRoom(action.payload) },
      });
    }
    case types.FETCH_MESSAGES_SUCCESS: {
      return ({
        ...state,
        byId: {
          ...state.byId,
          [action.payload.roomId]: {
            ...state.byId[action.payload.roomId],
            messages: action.payload.messages.map(message => message._id),
          },
        },
      });
    }
    case types.ADD_MESSAGE: {
      return ({
        ...state,
        byId: {
          ...state.byId,
          [action.payload.roomId]: {
            ...state.byId[action.payload.roomId],
            messages: [...state.byId[action.payload.roomId].messages, action.payload._id],
          },
        },
      });
    }
    case types.CURRENT_USER_LEAVE_ROOM: {
      const allIds = state.allIds.filter(id => id !== action.payload._id);
      const byId = {};
      Object.keys(state.byId).forEach((id) => {
        if (id !== action.payload._id) {
          byId[id] = state.byId[id];
        }
      });
      return ({
        ...state,
        allIds,
        byId,
      });
    }
    default: return state;
  }
};

export default rooms;
