import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { redirectTo } from 'utils/routing';
import { firebaseAuth } from 'utils/firebase_config';
import { logoutUser } from 'actions/login';
import { userSignedIn } from 'api/auth.js';
import Menu from 'components/Global/Menu';
import { routeCodes } from '../../routes';

@connect()
export default class App extends Component {
  static propTypes = {
    children: PropTypes.object,
    dispatch: PropTypes.func,
  }

  componentWillMount() {
    const { dispatch } = this.props;
    firebaseAuth().onAuthStateChanged((user) => {
      if (user) {
        redirectTo(routeCodes.ORDER);
      } else {
        redirectTo(routeCodes.LOGIN);
        dispatch(logoutUser);
      }
    });
  }

  render() {
    const { children } = this.props;

    return (
      <div className='App'>
        { userSignedIn() && <Menu /> }

        <div className='Page'>
          { children }
        </div>
      </div>
    );
  }
}
