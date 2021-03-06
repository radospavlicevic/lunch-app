import { db } from 'utils/firebase_config';

export function findUserByUID(uid) {
  return db.ref(`users/${ uid }`).once('value');
}

export function saveOrUpdateUser(uid, user) {
  return db.ref(`users/${ uid }`).set({
    role: user.role,
    username: user.username,
    email: user.email,
  });
}

export function updateUsername(uid, newUsername) {
  return db.ref(`users/${ uid }`).update({ username: newUsername });
}

export function updateRole(uid, newRole) {
  return db.ref(`users/${ uid }`).update({ role: newRole });
}

export function updatePassword(uid, newPassword) {
  return db.ref(`users/${ uid }`).update({ password: newPassword });
}

export function fetchAllUsers() {
  return db.ref('users').once('value');
}

export function removeUser(uid) {
  db.ref(`users/${ uid }`).remove();
}
