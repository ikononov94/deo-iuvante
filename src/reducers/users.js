import * as types from '../actions/types';

export default (
  state = {
    byId: {},
    fetching: false,
    errorMsg: null,
  },
  action,
) => {
  switch (action.type) {
    case types.FETCH_USERS_START: {
      return ({
        ...state,
        fetching: true,
      });
    }
    case types.FETCH_USERS_END: {
      return ({
        ...state,
        fetching: false,
      });
    }
    case types.FETCH_USERS_ERROR: {
      return ({
        ...state,
        errorMsg: action.error,
      });
    }
    case types.FETCH_USER_SUCCESS: {
      return ({
        ...state,
        byId: {
          ...state.byId,
          [action.payload._id]: action.payload,
        },
      });
    }
    case types.FETCH_USERS_SUCCESS: {
      return ({
        ...state,
        byId: action.payload.reduce((accum, user) => ({
          ...accum,
          [user._id]: user,
        }), { ...state.byId }),
      });
    }
    case types.USER_CHANGE_STATUS: {
      return ({
        ...state,
        byId: {
          ...state.byId,
          [action.payload.userId]: {
            ...state.byId[action.payload.userId],
            online: action.payload.status,
          },
        },
      });
    }
    default: return state;
  }
};

