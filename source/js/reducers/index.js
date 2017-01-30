import { combineReducers } from 'redux';
import login from 'reducers/login';
import users from 'reducers/users';
import meals from 'reducers/meals';

export default combineReducers({
  login,
  users,
  meals,
});
