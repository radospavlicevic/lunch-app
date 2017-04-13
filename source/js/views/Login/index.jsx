import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { login, googleLogin } from 'actions/login';
import { getGoogleAuthProvider } from 'api/auth';
import { firebaseAuth } from 'utils/firebase_config';
import { redirectTo } from 'utils/routing';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import md5 from 'md5';
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
    loginError: PropTypes.object,
    getUserError: PropTypes.object,
    dispatch: PropTypes.func,
  }

  constructor() {
    super();


    this.state = {
      googleAuthErrors: '',
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleGoogleSignInClick = this.handleGoogleSignInClick.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { loggedInUser } = this.props;
    if (nextProps.loggedInUser !== loggedInUser && nextProps.loggedInUser) {
      redirectTo(routeCodes.HOME);
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    const { dispatch } = this.props;
    const user = {
      email: this.email.input.value,
      password: md5(this.password.input.value),
    };
    dispatch(login(user));
  }

  handleGoogleSignInClick() {
    const { dispatch } = this.props;
    const googleAuthProvider = getGoogleAuthProvider();

    firebaseAuth().signInWithPopup(googleAuthProvider).then((result) => {
      if (!result.user.email.endsWith('work.co')) {
        firebaseAuth().signOut();
        this.setState({
          googleAuthErrors: 'Available only for work.co domen. ',
        });
      } else {
        dispatch(googleLogin(result.user));
      }
    }).catch(error => {
      this.setState({
        googleAuthErrors: error.message,
      });
    });
  }

  renderLoginErrors() {
    const { loginError, getUserError } = this.props;
    if (loginError) {
      return <span className='Message-LoginError'>{ loginError.message }</span>;
    } else if (getUserError) {
      return <span className='Message-LoginError'>{ getUserError.message }</span>;
    } else if (loginError && getUserError) {
      return (
        <div>
          <span className='Message-LoginError'>{ loginError.message }</span>
          <span className='Message-LoginError'>{ getUserError.message }</span>
        </div>
      );
    }
    return '';
  }

  render() {
    return (
      <div className='Login'>
        <div className='Login-container'>
          <h1>Login with your email</h1>
          <form className='ClientForm' onSubmit={ this.handleSubmit }>
            <TextField
              id='material-ui-ft-username'
              className='ClientForm-input'
              placeholder='E-mail'
              type='email'
              fullWidth={ true }
              ref={ node => this.email = node }
            />
            <TextField
              id='material-ui-ft-password'
              className='ClientForm-input'
              fullWidth={ true }
              type='password'
              placeholder='Password'
              ref={ node => this.password = node }
            />
            <RaisedButton type='submit' className='ClientForm-button' label='Login' style={ { marginTop: '1rem' } } />
          </form>
          <div className='errorContainer'>
            { this.renderLoginErrors() }
          </div>
          <RaisedButton
            className='Login-GoogleAuthButton'
            fullWidth={ true }
            primary={ true }
            onClick={ this.handleGoogleSignInClick }
            label='Google sign in'
            icon={ <img alt='Google plus icon' src={ googleIcon } /> }
          />
          { this.state.googleAuthErrors && <span className='Message-LoginError'>{ this.state.googleAuthErrors }</span> }
        </div>
      </div>
    );
  }
}
