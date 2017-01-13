import { Map } from 'immutable';

import {
  LOGIN_START,
  LOGIN_ERROR,
  LOGIN_SUCCESS,
  GET_USER_START,
  GET_USER_ERROR,
  GET_USER_SUCCESS,
} from 'actions/login';

const initialState = Map({
  // login
  loginLoading: false,
  loginError: null,
  loginData: null,
  // getUser
  getUserLoading: false,
  getUserError: null,
  loggedInUser: null,
});

const actionsMap = {

  // LOGIN actions
  [LOGIN_START]: (state) => {
    return state.merge(Map({
      loginLoading: true,
      loginError: null,
    }));
  },
  [LOGIN_ERROR]: (state, action) => {
    return state.merge(Map({
      loginLoading: false,
      loginError: action.error,
    }));
  },
  [LOGIN_SUCCESS]: (state, action) => {
    return state.merge(Map({
      loginLoading: false,
      loginData: action.data,
    }));
  },
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
};

export default function reducer(state = initialState, action = {}) {
  const fn = actionsMap[action.type];
  return fn ? fn(state, action) : state;
}
