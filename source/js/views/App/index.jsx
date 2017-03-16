import React, { Component, PropTypes } from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
import CircularProgress from 'material-ui/CircularProgress';
import { connect } from 'react-redux';
import { redirectTo } from 'utils/routing';
import { firebaseAuth } from 'utils/firebase_config';
import { publicPages } from 'utils/globals';
import { getUser, logout } from 'actions/login';
import { userSignedIn } from 'api/auth.js';
import Menu from 'components/Global/Menu';
import { routeCodes } from '../../routes';

injectTapEventPlugin();

@connect(state => ({
  loggedInUser: state.login.get('loggedInUser'),
  getUserLoading: state.login.get('getUserLoading'),
  adminMenuVisibile: state.app.get('adminMenuVisibile'),
}))
export default class App extends Component {
  static propTypes = {
    children: PropTypes.object,
    loggedInUser: PropTypes.object,
    dispatch: PropTypes.func,
  }

  componentWillMount() {
    const { dispatch } = this.props;
    localStorage.setItem('init-path', location.pathname);
    if (!this.isPublicPath()) {
      firebaseAuth().onAuthStateChanged((user) => {
        if (this.handleReauth()) return;
        if (user) {
          dispatch(getUser(user.uid));
        } else {
          redirectTo(routeCodes.LOGIN);
          dispatch(logout());
        }
      });
    } else {
      redirectTo(location.pathname);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { loggedInUser } = this.props;
    const path = localStorage.getItem('init-path');
    if (nextProps.loggedInUser !== loggedInUser) {
      if (nextProps.loggedInUser && path) {
        redirectTo(path);
        localStorage.removeItem('init-path');
      }
    }
  }

  isPublicPath() {
    return publicPages.includes(location.pathname);
  }

  checkLoadingScreen(loggedInUser) {
    return (!this.isPublicPath() && userSignedIn() && !loggedInUser) &&
    <div className='LoadingModal'>
      <CircularProgress />
      <CircularProgress size={ 60 } thickness={ 7 } />
      <CircularProgress size={ 80 } thickness={ 5 } />
      <CircularProgress size={ 100 } thickness={ 3 } />
    </div>;
  }

  checkMenu(loggedInUser) {
    return (!this.isPublicPath() && userSignedIn() && loggedInUser) && <Menu />;
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

        { this.checkLoadingScreen(loggedInUser) }
        { this.checkMenu(loggedInUser) }

        <div className='Page'>
          { children }
        </div>

      </div>
    );
  }
}
