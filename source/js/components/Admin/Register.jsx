import React, { Component, PropTypes } from 'react';
import { roles } from 'utils/routing';
import { firebaseRegister } from 'api/auth.js';
import { saveUser } from 'api/users.js';
import { getUserValidationErrors } from 'utils/validation';
import { prepareForReauthentication, reauthenticateAdmin } from 'utils/reauth';

export default class Register extends Component {

  static propTypes = {
    loggedInUser: PropTypes.object,
  }

  constructor() {
    super();
    this.state = {
      user: {
        role: roles.USER,
        username: '',
        email: '',
        password: '',
      },
      errors: {
        username: '',
        email: '',
        password: '',
      },
    };
    this.handleRoleChange = this.handleRoleChange.bind(this);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  resetForm() {
    this.setState({
      user: {
        role: roles.USER,
        username: '',
        email: '',
        password: '',
      },
      errors: {
        username: '',
        email: '',
        password: '',
      },
    });
  }

  handleUsernameChange(event) {
    this.setState({
      user: {
        ...this.state.user,
        username: event.target.value,
      },
    });
  }

  handleEmailChange(event) {
    this.setState({
      user: {
        ...this.state.user,
        email: event.target.value,
      },
    });
  }

  handlePasswordChange(event) {
    this.setState({
      user: {
        ...this.state.user,
        password: event.target.value,
      },
    });
  }

  handleRoleChange(changeEvent) {
    this.setState({
      user: {
        ...this.state.user,
        role: changeEvent.target.value,
      },
    });
  }

  validationPassed(errors) {
    return (errors && !errors.username && !errors.email && !errors.password);
  }

  handleSubmit(event) {
    event.preventDefault();
    const { loggedInUser } = this.props;
    const { user } = this.state;
    const validationErrors = getUserValidationErrors(user);
    if (this.validationPassed(validationErrors)) {
      prepareForReauthentication();
      firebaseRegister(user)
      .then(userRecord => {
        saveUser(userRecord.uid, user);
        reauthenticateAdmin(loggedInUser);
        this.resetForm();
      })
      .catch(error => {
        this.setState({
          errors: { email: error.message },
        });
      });
    } else {
      this.setState({
        errors: validationErrors,
      });
    }
  }

  renderRegisterErrors() {
    const { errors } = this.state;
    const registerErrors = [];
    if (errors) {
      Object.keys(errors).forEach(key => {
        registerErrors.push(errors[key]);
      });
    }
    return registerErrors.map((error, index) => <div key={ index } className='Message--error'>{ error }</div>);
  }

  render() {
    const { user, errors } = this.state;
    return (
      <div className='Register'>
        <h1>Register User</h1>
        <form className='AdminForm' onSubmit={ this.handleSubmit }>
          <div className='AdminForm-item'>
            <input
              placeholder='Username'
              className={ errors && errors.username ? 'AdminForm-input AdminForm-input--error' : 'AdminForm-input' }
              value={ user.username }
              onChange={ this.handleUsernameChange }
            />
          </div>
          <div className='AdminForm-item'>
            <input
              placeholder='Email'
              className={ errors && errors.email ? 'AdminForm-input AdminForm-input--error' : 'AdminForm-input' }
              value={ user.email }
              onChange={ this.handleEmailChange }
            />
          </div>
          <div className='AdminForm-item'>
            <input
              placeholder='Password' type='password'
              className={ errors && errors.password ? 'AdminForm-input AdminForm-input--error' : 'AdminForm-input' }
              value={ user.password }
              onChange={ this.handlePasswordChange }
            />
          </div>
          <div className='AdminForm-radioItem'>
            <span>
              <input
                type='radio' name='role' value={ roles.USER }
                checked={ user.role === roles.USER }
                onChange={ this.handleRoleChange }
              />
              { roles.USER }
            </span>
            <span>
              <input
                type='radio' name='role' value={ roles.ADMIN }
                checked={ user.role === roles.ADMIN }
                onChange={ this.handleRoleChange }
              />
              { roles.ADMIN }
            </span>
          </div>
          <button className='AdminForm-button'>Register</button>
        </form>
        { this.renderRegisterErrors() }
      </div>
    );
  }
}
