import { ref } from 'utils/firebase_config';

export function findUserByUID(uid) {
  return ref.child(`users/${ uid }`).once('value');
}

export function saveUser(uid, user) {
  return ref.child(`users/${ uid }`).set({
    role: user.role,
    username: user.username,
  });
}

export function saveAdmin(uid, user, pass) {
  return ref.child(`users/${ uid }`).set({
    role: user.role,
    username: user.username,
    password: pass,
  });
}
