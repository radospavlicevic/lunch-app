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
  selectedDate: state.orders.get('selectedDate'),
}))
export default class Profile extends Component {
  static propTypes = {
    loggedInUser: PropTypes.object,
    dispatch: PropTypes.func,
  }

  constructor(props) {
    super();

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);

    this.state = {
      username: (props.loggedInUser && props.loggedInUser.username) || '',
      error: '',
    };
  }

  componentWillMount() {
    document.title = 'Profile - Yummy Yumzor';
  }

  componentWillReceiveProps(nextProps) {
    const { loggedInUser, dispatch } = this.props;
    if (nextProps.loggedInUser !== loggedInUser && nextProps.loggedInUser) {
      if (nextProps.loggedInUser.username) {
        this.setState({
          username: nextProps.loggedInUser.username,
        });
      }
      if (loggedInUser && nextProps.loggedInUser.username !== loggedInUser.username) {
        dispatch(changeUsername(userSignedIn(), nextProps.loggedInUser.username));
        this.setState({
          username: nextProps.loggedInUser.username,
          error: '',
        });
      }
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    const { dispatch, loggedInUser } = this.props;
    const { username } = this.state;
    if (username) {
      updateUsername(userSignedIn().uid, username);
      dispatch(updateLoggedInUser({ ...loggedInUser, username }));
    } else {
      this.setState({
        error: 'Username cannot be empty. ',
      });
    }
  }

  handleInputChange(event) {
    this.setState({
      username: event.target.value,
    });
  }

  render() {
    const { username, error } = this.state;
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
              { error && <span className='Profile-form-errorMsg'>{ error }</span> }
            </div>
          </form>
        </div>
      </div>
    );
  }
}
