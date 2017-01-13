import { ref, firebaseAuth } from '../utils/firebase_config';

export function firebaseAuthSaveUser(user) {
  return ref.child(`users/${ user.uid }/info`).set({
    email: user.email,
    uid: user.uid,
  }).then(() => user);
}

export function firebaseAuthentication(user) {
  return firebaseAuth().createUserWithEmailAndPassword(user.email, user.password);
    // .then(firebaseAuthSaveUser)
    // .catch((error) => console.error('Error', error));
}

export function firebaseLogout() {
  return firebaseAuth().signOut();
}

export function firebaseLogin(user) {
  return firebaseAuth().signInWithEmailAndPassword(user.email, user.password);
}
