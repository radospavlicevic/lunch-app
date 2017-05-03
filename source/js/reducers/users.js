import { Map } from 'immutable';

import {
  ADD_OR_UPDATE_USER,
  DELETE_USER,
  CHANGE_PASSWORD,
  CHANGE_USERNAME,
  CHANGE_ROLE,
  PREPARE_USER_UPDATE,
  CANCEL_USER_UPDATE,
  LOAD_USERS,
} from 'actions/users';

const initialState = Map({
  users: {},
  userForUpdate: null,
});

const actionsMap = {

  [ADD_OR_UPDATE_USER]: (state, action) => {
    const users = { ...state.get('users'), [action.uid]: action.data };
    return state.merge(Map({
      users,
      userForUpdate: null,
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

  [CHANGE_USERNAME]: (state, action) => {
    const users = { ...state.get('users') };
    if (users[action.uid]) {
      users[action.uid].username = action.newUsername;
    }
    return state.merge(Map({
      users,
    }));
  },

  [CHANGE_ROLE]: (state, action) => {
    const users = { ...state.get('users') };
    if (users[action.uid]) {
      users[action.uid].role = action.newRole;
    }
    return state.merge(Map({
      users,
    }));
  },

  [PREPARE_USER_UPDATE]: (state, action) => {
    return state.merge(Map({
      userForUpdate: {
        uid: action.uid,
        data: action.data,
      },
    }));
  },

  [CANCEL_USER_UPDATE]: (state) => {
    return state.merge(Map({
      userForUpdate: null,
    }));
  },

  [LOAD_USERS]: (state, action) => {
    return state.merge(Map({
      users: action.data,
    }));
  },
};

export default function reducer(state = initialState, action = {}) {
  const fn = actionsMap[action.type];
  return fn ? fn(state, action) : state;
}
