// Util module used for admin reauthetication purposes after new user registration
import { firebaseLogin } from 'api/auth';

export function prepareForReauthentication() {
  localStorage.setItem('reauth', true);
  localStorage.setItem('redirect', true);
}

export function reauthenticateAdmin(admin) {
  const credentials = {
    email: admin.email,
    password: admin.password,
  };
  firebaseLogin(credentials);
}
