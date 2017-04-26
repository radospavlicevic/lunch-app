import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { getGoogleAuthProvider } from 'api/auth';
import { firebaseAuth } from 'utils/firebase_config';
import { redirectTo } from 'utils/routing';
import RaisedButton from 'material-ui/RaisedButton';
import googleIcon from '../../../assets/img/google-plus.png';
import { routeCodes } from '../../routes';

@connect(state => ({
  loggedInUser: state.login.get('loggedInUser'),
  loginLoading: state.login.get('loginLoading'),
  loginError: state.login.get('loginError'),
  getUserLoading: state.login.get('getUserLoading'),
  getUserError: state.login.get('getUserError'),
}))
export default class Login extends Component {

  static propTypes = {
    loggedInUser: PropTypes.object,
  }

  constructor() {
    super();

    this.state = {
      googleAuthErrors: '',
    };

    this.handleGoogleSignInClick = this.handleGoogleSignInClick.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { loggedInUser } = this.props;
    if (nextProps.loggedInUser !== loggedInUser && nextProps.loggedInUser) {
      redirectTo(routeCodes.HOME);
    }
  }

  handleGoogleSignInClick() {
    const googleAuthProvider = getGoogleAuthProvider();
    firebaseAuth().signInWithPopup(googleAuthProvider).then((result) => {
      if (!result.user.email.endsWith('work.co')) {
        result.user.delete();
        this.setState({
          googleAuthErrors: 'Available only for work.co domain. ',
        });
      }
    }).catch(error => {
      this.setState({
        googleAuthErrors: error.message,
      });
    });
  }

  render() {
    return (
      <div className='Login'>
        <h1>Login with your work.co email</h1>
        <RaisedButton
          className='Login-GoogleAuthButton'
          primary={ true }
          onClick={ this.handleGoogleSignInClick }
          label='Google accounts'
          icon={ <img alt='Google plus icon' src={ googleIcon } /> }
        />
        { this.state.googleAuthErrors && <span className='Message-LoginError'>{ this.state.googleAuthErrors }</span> }
      </div>
    );
  }
}
