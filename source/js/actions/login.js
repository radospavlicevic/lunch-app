import { findUserByUID } from 'api/users.js';
import { firebaseLogin } from 'api/auth.js';

export const LOGIN_START = 'LOGIN_START';
export const LOGIN_ERROR = 'LOGIN_ERROR';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';

export const GET_USER_START = 'GET_USER_START';
export const GET_USER_SUCCESS = 'GET_USER_SUCCESS';
export const GET_USER_ERROR = 'GET_USER_ERROR';

export const LOGOUT_USER = 'LOGOUT_USER';

// Get user

function getUserStart() {
  return {
    type: GET_USER_START,
  };
}

function getUserSuccess(data) {
  return {
    type: GET_USER_SUCCESS,
    data,
  };
}

function getUserError(error) {
  return {
    type: GET_USER_ERROR,
    error,
  };
}

export function getUser(uid) {
  return function (dispatch) {
    dispatch(getUserStart());

    findUserByUID(uid)
      .then(data => { console.log('getUserData', data.val()); dispatch(getUserSuccess(data.val()[1])); })
      .catch(error => dispatch(getUserError(error)));
  };
}

// Login

function loginStart() {
  return {
    type: LOGIN_START,
  };
}

function loginSuccess(data) {
  return {
    type: LOGIN_SUCCESS,
    data,
  };
}

function loginError(error) {
  return {
    type: LOGIN_ERROR,
    error,
  };
}

export function logoutUser() {
  return {
    type: LOGOUT_USER,
  };
}

export function login(user) {
  return function (dispatch) {
    dispatch(loginStart());

    firebaseLogin(user)
      .then(data => {
        dispatch(getUser(data.uid));
        dispatch(loginSuccess(data));
      })
      .catch(error => dispatch(loginError(error)));
  };
}
