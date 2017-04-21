import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { addOrUpdateUser, deleteUser } from 'actions/users';
import { db } from 'utils/firebase_config';
import UserOverview from 'components/Admin/UserOverview';
import AdminMenu from 'components/Admin/AdminMenu';
import CheckAdminRole from '../../decorators/AuthorizationDecorator';

@CheckAdminRole
@connect(state => ({
  users: state.users.get('users'),
}))
export default class Users extends Component {

  static propTypes = {
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
      dispatch(addOrUpdateUser(newUser.key, newUser.val()));
    });

    db.ref('users').on('child_removed', removedUser => {
      dispatch(deleteUser(removedUser.key));
    });

    db.ref('users').on('child_changed', changedUser => {
      dispatch(addOrUpdateUser(changedUser.key, changedUser.val()));
    });
  }

  render() {
    const { users } = this.props;
    return (
      <div className='Admin-wrapper'>
        <AdminMenu />
        <div className='Users'>
          <h2>Users</h2>
          <UserOverview users={ users } />
        </div>
      </div>
    );
  }
}
