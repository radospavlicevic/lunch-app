import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { redirectTo } from 'utils/routing';
import { firebaseAuth } from 'utils/firebase_config';
import { getUser, logoutUser } from 'actions/login';
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
    getUserLoading: PropTypes.bool,
    dispatch: PropTypes.func,
  }

  componentWillMount() {
    const { dispatch } = this.props;
    localStorage.setItem('init-path', location.pathname);
    firebaseAuth().onAuthStateChanged((user) => {
      if (this.handleReauth()) return;
      if (user) {
        dispatch(getUser(user.uid));
      } else {
        redirectTo(routeCodes.LOGIN);
        dispatch(logoutUser);
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    const { getUserLoading } = this.props;
    const path = localStorage.getItem('init-path');
    if (nextProps.getUserLoading !== getUserLoading) {
      if (!nextProps.getUserLoading && nextProps.loggedInUser) {
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
    const { children, getUserLoading } = this.props;

    return (
      <div className='App'>
        { getUserLoading && <div className='LoadingModal'>Loading...</div> }
        { userSignedIn() && <Menu /> }

        { !getUserLoading &&
          <div className='Page'>
            { children }
          </div>
        }
      </div>
    );
  }
}
