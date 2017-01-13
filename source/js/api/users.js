import { ref } from 'utils/firebase_config';

export function findUserByUID(uid) {
  return ref.child('users').orderByChild('uid').equalTo(uid).once('value');
}

export function findUserByEmail(email) {
  return ref.child('users').orderByChild('email').equalTo(email).once('value');
}
