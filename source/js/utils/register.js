// Util module used for admin reauthetication purposes after new user registration
import { firebaseLogin, userSignedIn } from '../api/auth';

export function prepareForReauthentication() {
  const { email } = userSignedIn();
  localStorage.setItem('admin', email);
  localStorage.setItem('register', true);
}

export function reauthenticateAdmin(pass) {
  const credentials = {
    email: localStorage.getItem('admin'),
    password: pass,
  };
  firebaseLogin(credentials);
}
