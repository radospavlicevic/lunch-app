import { combineReducers } from 'redux';
import login from 'reducers/login';
import users from 'reducers/users';

export default combineReducers({
  login,
  users,
});
