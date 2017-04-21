import { findUserByUID, saveOrUpdateUser } from 'api/users.js';
import { roles } from 'utils/globals';

export const GET_USER_START = 'GET_USER_START';
export const GET_USER_SUCCESS = 'GET_USER_SUCCESS';
export const GET_USER_ERROR = 'GET_USER_ERROR';

export const UPDATE_LOGGED_IN_USER = 'UPDATE_LOGGED_IN_USER';
export const LOGOUT = 'LOGOUT';

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

export function getUser(uid, email) {
  return function (dispatch) {
    dispatch(getUserStart());
    findUserByUID(uid)
      .then(response => {
        if (response.status >= 200 && response.status < 300) {
          response.json().then(data => {
            if (data) {
              dispatch(getUserSuccess(data));
            } else {
              const newUser = {
                username: '',
                role: roles.USER,
                email,
              };
              saveOrUpdateUser(uid, newUser);
              dispatch(getUserSuccess(newUser));
            }
          });
        } else {
          dispatch(getUserError('Bad request. '));
        }
      });
  };
}

export function logout() {
  return {
    type: LOGOUT,
  };
}

export function updateLoggedInUser(user) {
  return {
    type: UPDATE_LOGGED_IN_USER,
    user,
  };
}

// export function login(user) {
//   return function (dispatch) {
//     dispatch(loginStart());
//
//     firebaseLogin(user)
//       .then(data => {
//         dispatch(getUser(data.uid));
//         dispatch(loginSuccess(data));
//       })
//       .catch(error => dispatch(loginError(error)));
//   };
// }
