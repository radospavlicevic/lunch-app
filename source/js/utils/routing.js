import { browserHistory } from 'react-router';
import { roles } from './globals';
import { routeCodes } from '../routes';

export function redirectTo(page) {
  console.log('Page-->', page);
  browserHistory.push(page);
}

export function redirectByRole(role) {
  switch (role) {
    case roles.USER:
      redirectTo(routeCodes.ORDER);
      break;
    case roles.ADMIN:
      redirectTo(routeCodes.DASHBOARD);
      break;
    default:
      redirectTo(routeCodes.LOGIN);
  }
}

export function checkAdminRole(role) {
  if (role !== roles.ADMIN) {
    redirectTo(routeCodes.ORDER);
  }
}
