import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { login } from 'actions/login';
import md5 from 'md5';

@connect(state => ({
  loginLoading: state.login.get('loginLoading'),
  loginError: state.login.get('loginError'),
  getUserLoading: state.login.get('getUserLoading'),
  getUserError: state.login.get('getUserError'),
}))
export default class Login extends Component {

  static propTypes = {
    loginLoading: PropTypes.bool,
    loginError: PropTypes.object,
    getUserLoading: PropTypes.bool,
    getUserError: PropTypes.object,
    // from react-redux connect
    dispatch: PropTypes.func,
  }

  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
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
    const {
      loginLoading,
      getUserLoading,
    } = this.props;
    return (
      <div className='Login'>
        <h1>Login with your email</h1>
        <form className='ClientForm' onSubmit={ this.handleSubmit }>
          <input ref={ node => this.email = node } className='ClientForm-input' placeholder='Email' />
          <input ref={ node => this.password = node } className='ClientForm-input' placeholder='Password' type='password' />
          <button className='ClientForm-button'>Login</button>
        </form>
        { (loginLoading || getUserLoading) && <p>Loading...</p> }
        { this.renderLoginErrors() }
      </div>
    );
  }
}
