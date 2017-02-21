import { combineReducers } from 'redux';
import login from 'reducers/login';
import users from 'reducers/users';
import meals from 'reducers/meals';
import menus from 'reducers/menus';
import order from 'reducers/order';

export default combineReducers({
  login,
  users,
  meals,
  menus,
  order,
});
