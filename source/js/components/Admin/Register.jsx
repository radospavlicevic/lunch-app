import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { roles, objectsHasSameValues } from 'utils/globals';
import { firebaseRegister, firebaseLogin, firebaseUpdateUserEmail, firebaseUpdateUserPassword } from 'api/auth.js';
import { saveOrUpdateUser } from 'api/users.js';
import { cancelUserUpdate } from 'actions/users.js';
import { getUserValidationErrors } from 'utils/validation';
import { prepareForReauthentication, reauthenticateAdmin } from 'utils/reauth';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import md5 from 'md5';

@connect(state => ({
  userForUpdate: state.users.get('userForUpdate'),
}))
export default class Register extends Component {

  static propTypes = {
    loggedInUser: PropTypes.object,
    userForUpdate: PropTypes.object,
    dispatch: PropTypes.func,
  }

  constructor() {
    super();

    this.initState();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancelClick = this.handleCancelClick.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.userForUpdate) {
      this.initStateForUpdate(nextProps.userForUpdate.data);
    } else {
      this.initState();
    }
  }

  initState() {
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
        firebase: '',
      },
      update: false,
    };
  }

  initStateForUpdate(data) {
    this.setState({
      user: {
        role: data.role,
        username: data.username,
        email: data.email,
        password: '',
      },
      errors: {
        username: '',
        email: '',
        password: '',
        firebase: '',
      },
      update: true,
    });
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
        firebase: '',
      },
      update: false,
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

  handleCancelClick() {
    const { dispatch } = this.props;
    dispatch(cancelUserUpdate());
  }

  validationPassed(errors) {
    return (errors && !errors.username && !errors.email && !errors.password);
  }

  handleSubmit(event) {
    event.preventDefault();
    const { loggedInUser } = this.props;
    const { user, update } = this.state;
    const validationErrors = getUserValidationErrors(user, update);
    if (this.validationPassed(validationErrors)) {
      if (update) {
        this.updateUser(user, loggedInUser);
      } else {
        this.createUser(user, loggedInUser);
      }
    } else {
      this.setState({
        errors: validationErrors,
      });
    }
  }

  createUser(user, admin) {
    const encryptedUser = {
      ...user,
      password: md5(user.password),
    };
    prepareForReauthentication();
    firebaseRegister(encryptedUser)
    .then(userRecord => {
      saveOrUpdateUser(userRecord.uid, encryptedUser);
      reauthenticateAdmin(admin);
      this.resetForm();
    })
    .catch(error => {
      this.setState({
        errors: { email: error.message },
      });
    });
  }

  updateUser(user, admin) {
    const { userForUpdate } = this.props;
    const updatedUserData = { ...user,
      password: user.password ? md5(user.password) : userForUpdate.data.password,
    };
    if (!objectsHasSameValues(userForUpdate.data, updatedUserData)) {
      if (user.password || userForUpdate.data.email !== user.email) {
        prepareForReauthentication();
        firebaseLogin({ email: userForUpdate.data.email, password: userForUpdate.data.password })
          .then(updatedUser => {
            Promise.all([firebaseUpdateUserEmail(updatedUser, updatedUserData.email),
              firebaseUpdateUserPassword(updatedUser, updatedUserData.password)]).then(() => {
                reauthenticateAdmin(admin);
                saveOrUpdateUser(userForUpdate.uid, updatedUserData);
                this.resetForm();
              }).catch(error => {
                this.setState({
                  errors: { firebase: error.message },
                });
              });
          });
      } else {
        saveOrUpdateUser(userForUpdate.uid, updatedUserData);
        this.resetForm();
      }
    }
  }

  render() {
    const { user, errors, update } = this.state;
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
              hintText={ update ? 'New Password (or leave empty to keep old password)' : 'Password Field' }
              floatingLabelText='Password'
              fullWidth={ true }
              value={ user.password }
              onChange={ (e, value) => { this.handleChange(e, value, 'password'); } }
              errorText={ errors.password }
            />
            <RadioButtonGroup
              className='AdminForm-radioGroup'
              name='role'
              valueSelected={ user.role }
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
              label={ update ? 'Update User' : 'Register' }
              primary={ true }
            />
            { update &&
              <RaisedButton
                style={ { marginLeft: 10 } }
                className='AdminForm-button'
                label='Cancel'
                primary={ true }
                onClick={ this.handleCancelClick }
              />
            }
            { errors.firebase && <span className='AdminForm-error'>{ errors.firebase }</span> }
          </form>
        </div>
      </div>
    );
  }
}
