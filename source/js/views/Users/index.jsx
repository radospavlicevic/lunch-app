import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { addUser, deleteUser } from 'actions/users';
import { db } from 'utils/firebase_config';
import Register from 'components/Admin/Register';
import UserOverview from 'components/Admin/UserOverview';
import AdminMenu from 'components/Admin/AdminMenu';
import CheckAdminRole from '../../decorators/AuthorizationDecorator';

@CheckAdminRole

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
    this.setupFirebaseObservers();
    document.title = 'Users, Admin - Yummy Yumzor';
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
      <div className='Admin-wrapper'>
        <AdminMenu />
        <div className='Users'>
          <Register loggedInUser={ loggedInUser } />
          <UserOverview users={ users } admin={ loggedInUser } />
        </div>
      </div>
    );
  }
}
