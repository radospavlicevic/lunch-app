import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { addUser, deleteUser } from 'actions/users';
import { db } from 'utils/firebase_config';
import { checkAdminRole } from 'utils/routing';
import Register from 'components/Admin/Register';
import UserOverview from 'components/Admin/UserOverview';

@connect(state => ({
  loggedInUser: state.login.get('loggedInUser'),
  users: state.users.get('users'),
}))
export default class Users extends Component {

  static propTypes = {
    loggedInUser: PropTypes.object,
    users: PropTypes.object,
    dispatch: PropTypes.func,
  }

  componentWillMount() {
    const { loggedInUser } = this.props;
    checkAdminRole(loggedInUser && loggedInUser.role);
    this.setupFirebaseObservers();
  }

  setupFirebaseObservers() {
    const { dispatch } = this.props;
    db.ref('users').on('child_added', newUser => {
      dispatch(addUser(newUser.key, newUser.val()));
    });

    db.ref('users').on('child_removed', removedUser => {
      dispatch(deleteUser(removedUser.key));
    });
  }

  render() {
    const { loggedInUser, users } = this.props;
    return (
      <div className='Users Admin-wrapper'>
        <Register loggedInUser={ loggedInUser } />
        <UserOverview users={ users } admin={ loggedInUser } />
        {/* { fetchUsersLoading && <span>Loading...</span> } */}
      </div>
    );
  }
}
