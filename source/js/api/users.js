import { db } from 'utils/firebase_config';

export function findUserByUID(uid) {
  return db.ref(`users/${ uid }`).once('value');
}

export function saveUser(uid, user) {
  return db.ref(`users/${ uid }`).set({
    role: user.role,
    username: user.username,
    email: user.email,
    password: user.password,
  });
}

export function fetchAllUsers() {
  return db.ref('users').once('value');
}

export function removeUser(uid) {
  db.ref(`users/${ uid }`).remove();
}
