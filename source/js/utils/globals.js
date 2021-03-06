import moment from 'moment';
import { routeCodes } from '../routes';

export const dishOverviewTypes = {
  SELECTABLE: 'selectable',
  REMOVABLE: 'removable',
  EDITABLE: 'editable',
  PLAIN: 'plain',
};

export const roles = {
  USER: 'USER',
  ADMIN: 'ADMIN',
};

export const BREAKPOINTS = {
  sm: 500,
  md: 769,
  lg: 1025,
  xl: 2000,
};

export const DATE_PATTERN = 'DD-MM-YYYY';

export const DATE_PATTERN_SR = 'DD.MM.YYYY';

export const formatDate = (date) => { return moment(date).format(DATE_PATTERN); };

export function formatDateSr(date) {
  return moment(date, DATE_PATTERN).format(DATE_PATTERN_SR);
}

export const weekDays = ['Ponedeljak', 'Utorak', 'Sreda', 'Četvrtak', 'Petak'];

export const months = ['Januar', 'Februar', 'Mart', 'April', 'Maj', 'Jun', 'Jul', 'Avgust', 'Septembar', 'Oktobar', 'Novembar', 'Decembar'];

export const publicPages = ['/report'];

export const adminPages = [
  routeCodes.MENUS,
  routeCodes.USERS,
  routeCodes.CATEGORIES,
  routeCodes.CATERINGS,
  routeCodes.DISHES,
  routeCodes.WEEKLY_OVERVIEW,
];

export function isPastDate(date) {
  return moment().subtract(1, 'day').isAfter(moment(date, DATE_PATTERN));
}

export function objectsHasSameValues(obj1, obj2) {
  const keys = Object.keys(obj1);
  for (let i = 0; i < keys.length; i++) {
    if (obj1[keys[i]] !== obj2[keys[i]]) {
      return false;
    }
  }
  return true;
}
