import { browserHistory } from 'react-router';
import { routeCodes } from '../routes';

export const roles = {
  USER: 'USER',
  ADMIN: 'ADMIN',
};

export function redirectTo(page) {
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
