import { combineReducers } from 'redux';
import login from 'reducers/login';
import users from 'reducers/users';
import meals from 'reducers/meals';
import menus from 'reducers/menus';

export default combineReducers({
  login,
  users,
  meals,
  menus,
});
