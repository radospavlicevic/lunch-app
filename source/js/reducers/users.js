import { Map } from 'immutable';

import {
  ADD_USER,
  DELETE_USER,
  FETCH_USERS_START,
  FETCH_USERS_ERROR,
  FETCH_USERS_SUCCESS,
  CHANGE_PASSWORD,
} from 'actions/users';

const initialState = Map({
  users: {},
  // userForUpdate: null,
});

const actionsMap = {
  // USERS actions
  [ADD_USER]: (state, action) => {
    const users = { ...state.get('users'), [action.uid]: action.data };
    return state.merge(Map({
      users,
    }));
  },

  [DELETE_USER]: (state, action) => {
    const users = { ...state.get('users') };
    delete users[action.uid];
    return state.merge(Map({
      users,
    }));
  },

  [CHANGE_PASSWORD]: (state, action) => {
    const users = { ...state.get('users') };
    if (users[action.uid]) {
      users[action.uid].password = action.newPassword;
    }
    return state.merge(Map({
      users,
    }));
  },

  [FETCH_USERS_START]: (state) => {
    return state.merge(Map({
      fetchUsersLoading: true,
      fetchUsersError: null,
    }));
  },

  [FETCH_USERS_ERROR]: (state, action) => {
    return state.merge(Map({
      fetchUsersLoading: false,
      fetchUsersError: action.error,
    }));
  },

  [FETCH_USERS_SUCCESS]: (state, action) => {
    return state.merge(Map({
      fetchUsersLoading: false,
      users: action.data,
    }));
  },
};

export default function reducer(state = initialState, action = {}) {
  const fn = actionsMap[action.type];
  return fn ? fn(state, action) : state;
}
