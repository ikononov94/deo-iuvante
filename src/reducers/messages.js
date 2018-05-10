import { combineReducers } from 'redux';

import * as ActionTypes from '../actions/types';

export const flattenMessages = rooms => (
  rooms
    .map(room => room.messages)
    .reduce((acc, val) => acc.concat(val), [])
);

export const normalizeMessages = messages => (
  messages.reduce(
    (byId, message) => ({
      ...byId,
      [message._id]: message,
    }),
    {},
  )
);

export const addMessagesFromRooms = (state, action) => ({
  ...state,
  ...normalizeMessages(flattenMessages(action.payload)),
});

export const addMessage = (state, action) => ({
  ...state,
  [action.payload._id]: action.payload,
});

export const addMessages = (state, action) => ({
  ...state,
  ...normalizeMessages(action.payload.messages),
});

export const readMessages = (state, action) => {
  const messages =
    action.payload.map(messageId => ({
      ...state[messageId],
      attachments: {
        ...state[messageId].attachments,
        [state[messageId].userId]: {
          read: true,
        },
      },
    }));

  return ({
    ...state,
    ...normalizeMessages(messages),
  });
};

export const readMessagesForCurrentUser = (state, action) => {
  const messages =
  action.payload.map(messageId => ({
    ...state[messageId],
    attachments: {
      ...state[messageId].attachments,
      [action.currentUserId]: {
        read: true,
      },
    },
  }));

  return ({
    ...state,
    ...normalizeMessages(messages),
  });
};

export const messagesById = (state = {}, action) => {
  switch (action.type) {
    case ActionTypes.FETCH_ROOMS_SUCCESS: return addMessagesFromRooms(state, action);
    case ActionTypes.ADD_MESSAGE: return addMessage(state, action);
    case ActionTypes.FETCH_MESSAGES_SUCCESS: return addMessages(state, action);
    case ActionTypes.READ_MESSAGES: return readMessages(state, action);
    case ActionTypes.READ_MESSAGES_FOR_CURRENT_USER: return readMessagesForCurrentUser(state, action);
    default: return state;
  }
};

export default combineReducers({
  byId: messagesById,
});
