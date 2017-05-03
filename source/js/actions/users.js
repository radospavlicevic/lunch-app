export const ADD_OR_UPDATE_USER = 'ADD_OR_UPDATE_USER';
export const DELETE_USER = 'DELETE_USER';
export const CHANGE_PASSWORD = 'CHANGE_PASSWORD';
export const CHANGE_USERNAME = 'CHANGE_USERNAME';
export const CHANGE_ROLE = 'CHANGE_ROLE';
export const PREPARE_USER_UPDATE = 'PREPARE_USER_UPDATE';
export const CANCEL_USER_UPDATE = 'CANCEL_USER_UPDATE';
export const LOAD_USERS = 'LOAD_USERS';

export function addOrUpdateUser(uid, data) {
  return {
    type: ADD_OR_UPDATE_USER,
    uid,
    data,
  };
}

export function deleteUser(uid) {
  return {
    type: DELETE_USER,
    uid,
  };
}

export function changePassword(uid, newPassword) {
  return {
    type: CHANGE_PASSWORD,
    uid,
    newPassword,
  };
}

export function changeUsername(uid, newUsername) {
  return {
    type: CHANGE_USERNAME,
    uid,
    newUsername,
  };
}

export function changeRole(uid, newRole) {
  return {
    type: CHANGE_ROLE,
    uid,
    newRole,
  };
}

export function prepareUserUpdate(uid, data) {
  return {
    type: PREPARE_USER_UPDATE,
    uid,
    data,
  };
}

export function cancelUserUpdate() {
  return {
    type: CANCEL_USER_UPDATE,
  };
}

export function loadUsers(data) {
  return {
    type: LOAD_USERS,
    data,
  };
}
