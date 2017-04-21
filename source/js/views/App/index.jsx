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
    if (location.pathname !== routeCodes.LOGIN) localStorage.setItem('init-path', location.pathname);
    if (!this.isPublicPath()) {
      firebaseAuth().onAuthStateChanged((user) => {
        if (user && user.email.endsWith('work.co')) {
          dispatch(getUser(user.uid, user.email));
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
    if (nextProps.loggedInUser !== loggedInUser && nextProps.loggedInUser) {
      if (path) {
        redirectTo(path);
        localStorage.removeItem('init-path');
      } else {
        redirectTo(nextProps.loggedInUser && nextProps.loggedInUser.username ?
          routeCodes.HOME : routeCodes.PROFILE);
      }
    }
  }

  isPublicPath() {
    return publicPages.includes(location.pathname);
  }

  checkLoadingScreen(loggedInUser) {
    return (!this.isPublicPath() && userSignedIn() && !loggedInUser) &&
    <div className='LoadingModal'>
      <CircularProgress size={ 100 } thickness={ 5 } />
    </div>;
  }

  checkMenu(loggedInUser) {
    return (!this.isPublicPath() && userSignedIn() && loggedInUser) && <Menu />;
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
