import { firebaseAuth } from 'utils/firebase_config';
import { reauthenticateAdmin } from 'utils/reauth';

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

// removes user from firebase auth db
export function deleteUserFromAuthDB(user, admin) {
  firebaseAuth().signInWithEmailAndPassword(user.email, user.password)
    .then(exUser => {
      localStorage.setItem('signout', true);
      exUser.delete().then(() => reauthenticateAdmin(admin));
    });
}
