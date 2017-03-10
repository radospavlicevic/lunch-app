import { combineReducers } from 'redux';
import app from 'reducers/app';
import login from 'reducers/login';
import users from 'reducers/users';
import meals from 'reducers/meals';
import menus from 'reducers/menus';
import orders from 'reducers/orders';

export default combineReducers({
  app,
  login,
  users,
  meals,
  menus,
  orders,
});
