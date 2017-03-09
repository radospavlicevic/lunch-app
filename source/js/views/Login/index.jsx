import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { login } from 'actions/login';
import { redirectTo } from 'utils/routing';
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
    // from react-redux connect
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
      email: this.email.value,
      password: md5(this.password.value),
    };
    dispatch(login(user));
  }

  // refactor
  renderLoginErrors() {
    const { loginError, getUserError } = this.props;
    if (loginError) {
      return <span className='Message--error'>{ loginError.message }</span>;
    } else if (getUserError) {
      return <span className='Message--error'>{ getUserError.message }</span>;
    } else if (loginError && getUserError) {
      return (
        <div>
          <span className='Message--error'>{ loginError.message }</span>
          <span className='Message--error'>{ getUserError.message }</span>
        </div>
      );
    }
    return '';
  }

  render() {
    return (
      <div className='Login'>
        <h1>Login with your email</h1>
        <form className='ClientForm' onSubmit={ this.handleSubmit }>
          <input ref={ node => this.email = node } className='ClientForm-input' placeholder='Email' />
          <input ref={ node => this.password = node } className='ClientForm-input' placeholder='Password' type='password' />
          <button className='ClientForm-button'>Login</button>
        </form>
        { this.renderLoginErrors() }
      </div>
    );
  }
}
