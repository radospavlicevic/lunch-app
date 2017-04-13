import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { userSignedIn, firebaseUpdatePassword, getGoogleAuthProvider } from 'api/auth';
import { updatePassword } from 'api/users';
import { updateLoggedInUser } from 'actions/login';
import { changePassword } from 'actions/users';
import { checkPassword } from 'utils/validation';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import md5 from 'md5';
import googleIcon from '../../../assets/img/google-plus.png';

const GOOGLE_PROVIDER_ID = 'google.com';

@connect(state => ({
  loggedInUser: state.login.get('loggedInUser'),
}))
export default class Profile extends Component {
  static propTypes = {
    loggedInUser: PropTypes.object,
    dispatch: PropTypes.func,
  }

  constructor() {
    super();

    this.handleSubmitDialogOpen = this.handleSubmitDialogOpen.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleGoogleButtonClick = this.handleGoogleButtonClick.bind(this);

    this.state = {
      oldPassword: '',
      newPassword: '',
      newPasswordRepeat: '',
      open: false,
      success: false,
      errors: {
        old: '',
        new: '',
        repeat: '',
        firebase: '',
      },
      google: {
        linked: this.googleAccountLinked() || false,
        error: '',
        success: false,
      },
    };
  }

  componentWillMount() {
    document.title = 'Profile - Yummy Yumzor';
  }

  componentWillReceiveProps(nextProps) {
    const { loggedInUser, dispatch } = this.props;
    if (nextProps.loggedInUser !== loggedInUser && nextProps.loggedInUser) {
      this.setState({
        google: {
          linked: this.googleAccountLinked(),
        },
      });
      if (loggedInUser && nextProps.loggedInUser.password !== loggedInUser.password) {
        dispatch(changePassword(userSignedIn(), loggedInUser));
        this.setState({
          open: false,
          success: true,
        });
      }
    }
  }

  getValidationErrors() {
    return {
      old: this.checkOldPassword(),
      new: checkPassword(this.state.newPassword, 'New Password'),
      repeat: this.checkPasswordRepeat(),
    };
  }

  googleAccountLinked() {
    return userSignedIn() && userSignedIn().providerData[0].providerId === GOOGLE_PROVIDER_ID;
  }

  resetForm() {
    this.setState({
      oldPassword: '',
      newPassword: '',
      newPasswordRepeat: '',
    });
  }

  resetErrors() {
    this.setState({
      errors: {
        old: '',
        new: '',
        repeat: '',
        firebase: '',
      },
    });
  }

  handleSubmitDialogOpen(event) {
    event.preventDefault();
    const errors = this.getValidationErrors();
    if (this.validationPassed(errors)) {
      this.setState({
        open: true,
      });
      this.resetErrors();
    } else {
      this.setState({
        errors,
      });
    }
  }

  handleSubmit() {
    const { dispatch, loggedInUser } = this.props;
    const newEncryptedPassword = md5(this.state.newPassword);
    firebaseUpdatePassword(newEncryptedPassword).then(() => {
      updatePassword(userSignedIn().uid, newEncryptedPassword);
      dispatch(updateLoggedInUser({ ...loggedInUser, password: newEncryptedPassword }));
      this.resetForm();
    }, (error) => {
      this.setState({
        errors: {
          ...this.state.errors,
          firebase: error.message,
        },
      });
    });
  }

  handleInputChange(event, stateProperty) {
    this.setState({
      [stateProperty]: event.target.value,
    });
  }

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleGoogleButtonClick() {
    const { google } = this.state;
    if (google.linked) {
      this.unlinkGoogleAccount();
    } else {
      this.linkGoogleAccount();
    }
  }

  linkGoogleAccount() {
    const googleAuthProvider = getGoogleAuthProvider();
    userSignedIn().linkWithPopup(googleAuthProvider).then((result) => {
      const { email } = result.user.providerData[0];
      console.log('--EMAIL', email);
      if (!email.endsWith('work.co')) {
        this.unlinkGoogleAccount(true);
        this.setState({
          google: {
            error: 'Only work.co accounts available. ',
          },
        });
      } else {
        this.setState({
          google: {
            linked: true,
            success: true,
          },
        });
      }
    }).catch((error) => {
      this.setState({
        google: {
          error: error.message,
        },
      });
    });
  }

  unlinkGoogleAccount(inBackground = false) {
    userSignedIn().unlink(GOOGLE_PROVIDER_ID).then(() => {
      this.setState({
        google: {
          ...this.state.google,
          linked: false,
          success: !inBackground,
        },
      });
    }).catch((error) => {
      this.setState({
        google: {
          error: error.message,
        },
      });
    });
  }

  validationPassed(errors) {
    return !(errors.old || errors.new || errors.repeat);
  }

  checkOldPassword() {
    if (!this.state.oldPassword) return 'Old password field is required';
    if (this.props.loggedInUser.password !== md5(this.state.oldPassword)) return 'Wrong old password. ';
    return '';
  }

  checkPasswordRepeat() {
    const { newPassword, newPasswordRepeat } = this.state;
    if (!newPasswordRepeat) return 'Repeat password field is required';
    return (newPassword !== newPasswordRepeat) ? 'Password doesn\'t match' : '';
  }

  renderGoogleAccountButton() {
    const { google } = this.state;
    return (
      <RaisedButton
        className='Profile-GoogleAccountButton'
        label={ `${ google.linked ? 'Remove' : 'Add' } Google Account` }
        primary={ true }
        icon={ <img alt='Google plus icon' src={ googleIcon } /> }
        onClick={ this.handleGoogleButtonClick }
      />
    );
  }

  render() {
    const {
      oldPassword, newPassword, newPasswordRepeat,
      open, success, errors, google,
    } = this.state;

    const actions = [
      <RaisedButton
        style={ { margin: '0 5px' } }
        label='Back'
        primary={ true }
        onTouchTap={ this.handleClose }
      />,
      <RaisedButton
        style={ { margin: '0 5px' } }
        secondary={ true }
        label={ 'Submit new password' }
        onClick={ this.handleSubmit }
      />,
    ];
    return (
      <div className='Profile'>
        <div className='Profile-contentWrapper'>
          <form className='Profile-form' onSubmit={ this.handleSubmitDialogOpen }>
            <h1>Change password</h1>
            <TextField
              hintText='Old Password'
              className='Profile-form-input'
              type='password'
              value={ oldPassword }
              onChange={ (e) => { this.handleInputChange(e, 'oldPassword'); } }
              errorText={ errors.old }
              fullWidth={ true }
            />
            <TextField
              hintText='New Password'
              className='Profile-form-input'
              type='password'
              value={ newPassword }
              onChange={ (e) => { this.handleInputChange(e, 'newPassword'); } }
              errorText={ errors.new }
              fullWidth={ true }
            />
            <TextField
              hintText='Repeat New Password'
              className='Profile-form-input'
              type='password'
              value={ newPasswordRepeat }
              onChange={ (e) => { this.handleInputChange(e, 'newPasswordRepeat'); } }
              errorText={ errors.repeat }
              fullWidth={ true }
            />
            <div className='Profile-form-footer'>
              <div className='Profile-form-submitButton'>
                <RaisedButton label={ 'Submit' } type='submit' secondary={ true } style={ { maxWidth: 500 } } />
                <Dialog
                  actions={ actions }
                  modal={ false }
                  open={ open }
                  onRequestClose={ this.handleClose }
                >
                  <p className='Profile-changePasswordQuestion'>Are you sure you want to submit your new password?</p>
                  { errors.firebase &&
                    <div className='Profile-errorMessage'>{ errors.firebase }</div>
                  }
                </Dialog>
              </div>
              { success && <span className='Profile-form-success'>Password changed successfully.</span> }
            </div>
          </form>
          { this.renderGoogleAccountButton() }
          { google.error &&
            <div className='Profile-GoogleErrorMessage'>{ google.error }</div>
          }
          { google.success &&
            <div className='Profile-GoogleInfoMessage'>Google account { google.linked ? 'added' : 'removed' } successfully. </div>
          }
        </div>
      </div>
    );
  }
}
