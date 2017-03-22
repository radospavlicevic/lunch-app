import { browserHistory } from 'react-router';
import { roles } from './globals';
import { routeCodes } from '../routes';

export function redirectTo(page) {
  browserHistory.push(page);
}

export function checkAdminRole(role) {
  if (role !== roles.ADMIN) {
    redirectTo(routeCodes.HOME);
  }
}
