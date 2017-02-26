import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { redirectTo } from 'utils/routing';
import { firebaseAuth } from 'utils/firebase_config';
import { getUser, logoutUser } from 'actions/login';
import { userSignedIn } from 'api/auth.js';
import Menu from 'components/Global/Menu';
import { routeCodes } from '../../routes';

@connect(state => ({
  getUserLoading: state.login.get('getUserLoading'),
}))
export default class App extends Component {
  static propTypes = {
    children: PropTypes.object,
    getUserLoading: PropTypes.bool,
    dispatch: PropTypes.func,
  }

  componentWillMount() {
    const { dispatch } = this.props;
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

  componentWillReceiveProps() {
    const { getUserLoading } = this.props;
    const path = location.pathname;
    if (!getUserLoading) {
      if (this.rootOrLogin(path)) {
        redirectTo(routeCodes.ORDER);
      } else {
        redirectTo(path);
      }
    }
  }

  rootOrLogin(path) {
    return (path === '/' || path === '/login');
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

        <div className='Page'>
          { children }
        </div>
      </div>
    );
  }
}
