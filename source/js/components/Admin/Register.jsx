import React, { Component, PropTypes } from 'react';
import { roles } from 'utils/globals';
import { firebaseRegister } from 'api/auth.js';
import { saveUser } from 'api/users.js';
import { getUserValidationErrors } from 'utils/validation';
import { prepareForReauthentication, reauthenticateAdmin } from 'utils/reauth';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import md5 from 'md5';

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

  handleChange(event, value, propertyName) {
    this.setState({
      user: {
        ...this.state.user,
        [propertyName]: value,
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
    const encryptedUser = {
      ...user,
      password: md5(user.password),
    };
    const validationErrors = getUserValidationErrors(user);
    if (this.validationPassed(validationErrors)) {
      prepareForReauthentication();
      firebaseRegister(encryptedUser)
      .then(userRecord => {
        saveUser(userRecord.uid, encryptedUser);
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

  render() {
    const { user, errors } = this.state;
    return (
      <div className='Register'>
        <div className='AdminForm-wrapper'>
          <form className='AdminForm' onSubmit={ this.handleSubmit }>
            <h2>Users</h2>
            <TextField
              hintText='Username Field'
              floatingLabelText='Username'
              fullWidth={ true }
              value={ user.username }
              onChange={ (e, value) => { this.handleChange(e, value, 'username'); } }
              errorText={ errors.username }
            />
            <TextField
              hintText='Email Field'
              floatingLabelText='Email'
              fullWidth={ true }
              value={ user.email }
              onChange={ (e, value) => { this.handleChange(e, value, 'email'); } }
              errorText={ errors.email }
            />
            <TextField
              hintText='Password Field'
              floatingLabelText='Password'
              fullWidth={ true }
              value={ user.password }
              onChange={ (e, value) => { this.handleChange(e, value, 'password'); } }
              errorText={ errors.password }
            />
            <RadioButtonGroup
              className='AdminForm-radioGroup'
              name='userRole'
              defaultSelected={ user.role }
              onChange={ (e, value) => { this.handleChange(e, value, 'role'); } }
            >
              <RadioButton
                className='AdminForm-radioButton'
                value={ roles.USER }
                label={ roles.USER }
              />
              <RadioButton
                className='AdminForm-radioButton'
                value={ roles.ADMIN }
                label={ roles.ADMIN }
              />
            </RadioButtonGroup>
            <RaisedButton
              type='submit'
              className='AdminForm-button'
              label='Register'
              primary={ true }
            />
          </form>
        </div>
      </div>
    );
  }
}
