import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { loadUsers } from 'actions/users';
import UserOverview from 'components/Admin/UserOverview';
import AdminMenu from 'components/Admin/AdminMenu';
import { observableModule } from 'components/Observable/ObservableModule';
import CheckAdminRole from '../../decorators/AuthorizationDecorator';

@CheckAdminRole
@connect(state => ({
  users: state.users.get('users'),
}))
export default class Users extends Component {

  static propTypes = {
    users: PropTypes.object,
  }

  componentWillMount() {
    observableModule.addValueObserver('users', loadUsers);
    document.title = 'Users, Admin - Yummy Yumzor';
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
