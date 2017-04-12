export const ADD_OR_UPDATE_USER = 'ADD_OR_UPDATE_USER';
export const DELETE_USER = 'DELETE_USER';
export const UPDATE_USER = 'UPDATE_USER';
export const CHANGE_PASSWORD = 'CHANGE_PASSWORD';
export const PREPARE_USER_UPDATE = 'PREPARE_USER_UPDATE';
export const CANCEL_USER_UPDATE = 'CANCEL_USER_UPDATE';

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
