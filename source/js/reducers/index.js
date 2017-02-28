import { combineReducers } from 'redux';
import login from 'reducers/login';
import users from 'reducers/users';
import meals from 'reducers/meals';
import menus from 'reducers/menus';
import orders from 'reducers/orders';

export default combineReducers({
  login,
  users,
  meals,
  menus,
  orders,
});
