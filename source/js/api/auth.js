import { firebaseAuth } from 'utils/firebase_config';

export function firebaseRegister(user) {
  return firebaseAuth().createUserWithEmailAndPassword(user.email, user.password);
}

export function firebaseLogout() {
  return firebaseAuth().signOut();
}

export function firebaseLogin(user) {
  return firebaseAuth().signInWithEmailAndPassword(user.email, user.password);
}

export function userSignedIn() {
  return firebaseAuth().currentUser;
}

export function firebaseUpdatePassword(newPassword) {
  return userSignedIn().updatePassword(newPassword);
}

export function firebaseUpdateUserEmail(user, newEmail) {
  return user.updateEmail(newEmail);
}

export function firebaseUpdateUserPassword(user, newPassword) {
  return user.updatePassword(newPassword);
}

export function getGoogleAuthProvider() {
  return new firebaseAuth.GoogleAuthProvider();
}
