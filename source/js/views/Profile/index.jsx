import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { userSignedIn } from 'api/auth';
import { updateUsername } from 'api/users';
import { updateLoggedInUser } from 'actions/login';
import { changeUsername } from 'actions/users';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

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

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);

    this.state = {
      username: '',
      success: false,
    };
  }

  componentWillMount() {
    document.title = 'Profile - Yummy Yumzor';
  }

  componentWillReceiveProps(nextProps) {
    const { loggedInUser, dispatch } = this.props;
    if (nextProps.loggedInUser !== loggedInUser && nextProps.loggedInUser) {
      if (loggedInUser && nextProps.loggedInUser.username !== loggedInUser.username) {
        dispatch(changeUsername(userSignedIn(), nextProps.loggedInUser.username));
        this.setState({
          success: true,
          username: '',
        });
      }
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    const { dispatch, loggedInUser } = this.props;
    const { username } = this.state;
    updateUsername(userSignedIn().uid, username);
    dispatch(updateLoggedInUser({ ...loggedInUser, username }));
  }

  handleInputChange(event) {
    this.setState({
      username: event.target.value,
    });
  }

  render() {
    const { username, success } = this.state;
    return (
      <div className='Profile'>
        <div className='Profile-contentWrapper'>
          <form className='Profile-form' onSubmit={ this.handleSubmit }>
            <h1>Enter username</h1>
            <TextField
              hintText='Should be first and last name'
              className='Profile-form-input'
              value={ username }
              onChange={ this.handleInputChange }
              fullWidth={ true }
            />
            <div className='Profile-form-footer'>
              <div className='Profile-form-submitButton'>
                <RaisedButton label={ 'Submit' } type='submit' secondary={ true } style={ { maxWidth: 500 } } />
              </div>
              { success && <span className='Profile-form-success'>Username changed successfully.</span> }
            </div>
          </form>
        </div>
      </div>
    );
  }
}
