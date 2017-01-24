import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { addUser, deleteUser } from 'actions/users';
import { db } from 'utils/firebase_config';
import Register from 'components/Admin/Register';
import UserOverview from 'components/Admin/UserOverview';

@connect(state => ({
  loggedInUser: state.login.get('loggedInUser'),
  usersData: state.users.get('usersData'),
}))
export default class Users extends Component {

  static propTypes = {
    loggedInUser: PropTypes.object,
    usersData: PropTypes.array,
    dispatch: PropTypes.func,
  }

  componentWillMount() {
    this.setupFirebaseObservers();
  }

  setupFirebaseObservers() {
    const { dispatch } = this.props;
    db.ref('users').on('child_added', newDBUser => {
      const newUser = {
        uid: newDBUser.key,
        user: newDBUser.val(),
      };
      dispatch(addUser(newUser));
    });

    db.ref('users').on('child_removed', removedDBUser => {
      const removedUser = {
        uid: removedDBUser.key,
        user: removedDBUser.val(),
      };
      dispatch(deleteUser(removedUser));
    });
  }

  render() {
    const { loggedInUser, usersData } = this.props;
    return (
      <div className='Users'>
        <Register loggedInUser={ loggedInUser } />
        <UserOverview usersData={ usersData } admin={ loggedInUser } />
        {/* { fetchUsersLoading && <span>Loading...</span> } */}
      </div>
    );
  }
}
