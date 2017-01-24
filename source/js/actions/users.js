import { fetchAllUsers } from 'api/users.js';

export const FETCH_USERS_START = 'FETCH_USERS_START';
export const FETCH_USERS_ERROR = 'FETCH_USERS_ERROR';
export const FETCH_USERS_SUCCESS = 'FETCH_USERS_SUCCESS';

export const ADD_USER = 'ADD_USER';
export const DELETE_USER = 'DELETE_USER';
export const UPDATE_USER = 'UPDATE_USER';

function fetchUsersStart() {
  return {
    type: FETCH_USERS_START,
  };
}

function fetchUsersSuccess(data) {
  return {
    type: FETCH_USERS_SUCCESS,
    data,
  };
}

function fetchUsersError(error) {
  return {
    type: FETCH_USERS_ERROR,
    error,
  };
}

export function addUser(data) {
  return {
    type: ADD_USER,
    data,
  };
}

export function deleteUser(data) {
  return {
    type: DELETE_USER,
    data,
  };
}

export function updateUser(data) {
  return {
    type: UPDATE_USER,
    data,
  };
}

function mapUsersToArray(users) {
  const result = [];
  Object.keys(users).forEach(key => {
    result.push({
      uid: key,
      user: users[key],
    });
  });
  return result;
}

export function fetchUsers() {
  return function (dispatch) {
    dispatch(fetchUsersStart());

    fetchAllUsers()
      .then(data => dispatch(fetchUsersSuccess(mapUsersToArray(data.val()))))
      .catch(error => dispatch(fetchUsersError(error)));
  };
}
