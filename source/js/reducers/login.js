import { Map } from 'immutable';

import {
  GET_USER_START,
  GET_USER_ERROR,
  GET_USER_SUCCESS,
  UPDATE_LOGGED_IN_USER,
  LOGOUT,
} from 'actions/login';

const initialState = Map({
  // getUser
  getUserLoading: false,
  getUserError: null,
  loggedInUser: null,
});

const actionsMap = {

  // GET_USER actions
  [GET_USER_START]: (state) => {
    return state.merge({
      getUserLoading: true,
      getUserError: null,
    });
  },
  [GET_USER_ERROR]: (state, action) => {
    return state.merge(Map({
      getUserLoading: false,
      getUserError: action.data,
    }));
  },
  [GET_USER_SUCCESS]: (state, action) => {
    return state.merge(Map({
      getUserLoading: false,
      loggedInUser: action.data,
    }));
  },
  [UPDATE_LOGGED_IN_USER]: (state, action) => {
    return state.merge(Map({
      loggedInUser: action.user,
    }));
  },
  [LOGOUT]: (state) => {
    return state.merge(Map({
      loggedInUser: null,
    }));
  },
};

export default function reducer(state = initialState, action = {}) {
  const fn = actionsMap[action.type];
  return fn ? fn(state, action) : state;
}
