import * as types from './types';
import api from '../api';

export const fetchUsers = () => (
  async (dispatch) => {
    dispatch({
      type: types.FETCH_USERS_START,
    });

    try {
      const payload = await api.getUsers();

      dispatch({
        type: types.FETCH_USERS_SUCCESS,
        payload,
      });
    } catch (error) {
      dispatch({
        type: types.FETCH_USERS_ERROR,
        error,
      });
    } finally {
      dispatch({
        type: types.FETCH_USERS_END,
      });
    }
  }
);

export const fetchUser = id => (
  async (dispatch) => {
    dispatch({
      type: types.FETCH_USERS_START,
    });

    try {
      const payload = await api.getUser(id);

      dispatch({
        type: types.FETCH_USER_SUCCESS,
        payload,
      });
    } catch (error) {
      dispatch({
        type: types.FETCH_USERS_ERROR,
        error,
      });
    } finally {
      dispatch({
        type: types.FETCH_USERS_END,
      });
    }
  }
);

export const userChangeStatus = user => (
  (dispatch) => {
    dispatch({
      type: types.USER_CHANGE_STATUS,
      payload: user,
    });
  }
);
