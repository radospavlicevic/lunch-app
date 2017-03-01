import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { redirectTo } from 'utils/routing';
import { firebaseAuth } from 'utils/firebase_config';
import { getUser, logout } from 'actions/login';
import { userSignedIn } from 'api/auth.js';
import Menu from 'components/Global/Menu';
import { routeCodes } from '../../routes';

@connect(state => ({
  loggedInUser: state.login.get('loggedInUser'),
  getUserLoading: state.login.get('getUserLoading'),
}))
export default class App extends Component {
  static propTypes = {
    children: PropTypes.object,
    loggedInUser: PropTypes.object,
    dispatch: PropTypes.func,
  }

  componentWillMount() {
    const { dispatch } = this.props;
    firebaseAuth().onAuthStateChanged((user) => {
      localStorage.setItem('init-path', location.pathname);
      if (this.handleReauth()) return;
      if (user) {
        dispatch(getUser(user.uid));
      } else {
        redirectTo(routeCodes.LOGIN);
        dispatch(logout());
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    const { loggedInUser } = this.props;
    const path = localStorage.getItem('init-path');
    if (nextProps.loggedInUser !== loggedInUser) {
      if (nextProps.loggedInUser && path) {
        if (this.isLoginPath(path)) {
          redirectTo(routeCodes.ORDER);
        } else {
          redirectTo(path);
        }
        localStorage.removeItem('init-path');
      }
    }
  }

  isLoginPath(path) {
    return (path === '/login');
  }

  handleReauth() {
    if (localStorage.getItem('reauth')) {
      localStorage.removeItem('reauth');
      return true;
    }
    if (localStorage.getItem('signout')) {
      localStorage.removeItem('signout');
      return true;
    }
    if (localStorage.getItem('redirect')) {
      redirectTo(routeCodes.USERS);
      localStorage.removeItem('redirect');
      return true;
    }
    return false;
  }

  render() {
    const { children, loggedInUser } = this.props;
    return (
      <div className='App'>
        { (userSignedIn() && !loggedInUser) && <div className='LoadingModal'>Loading...</div> }
        { (userSignedIn() && loggedInUser) && <Menu /> }

        <div className='Page'>
          { children }
        </div>

      </div>
    );
  }
}
