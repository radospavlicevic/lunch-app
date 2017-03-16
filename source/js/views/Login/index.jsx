import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { login } from 'actions/login';
import { redirectTo } from 'utils/routing';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import md5 from 'md5';
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

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { loggedInUser } = this.props;
    if (nextProps.loggedInUser !== loggedInUser && nextProps.loggedInUser) {
      redirectTo(routeCodes.ORDER);
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
            <RaisedButton type='submit' className='ClientForm-button' style={ { marginTop: '1rem' } } >Login</RaisedButton>
          </form>
          <div className='errorContainer'>
            { this.renderLoginErrors() }
          </div>
        </div>
      </div>
    );
  }
}
