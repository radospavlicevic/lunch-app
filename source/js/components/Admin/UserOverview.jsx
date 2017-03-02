
import React, { Component, PropTypes } from 'react';
import UserItem from './UserItem';

export default class UserOverview extends Component {
  static propTypes = {
    admin: PropTypes.object,
    users: PropTypes.object,
  }

  renderUsers() {
    const { admin, users } = this.props;
    return users && Object.keys(users).map((key, index) => {
      return <UserItem key={ index } admin={ admin } user={ { uid: key, data: users[key] } } />;
    });
  }

  render() {
    return (
      <div className='UserOverview'>
        <h1>User Overview</h1>
        <table className='AdminTable table'>
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            { this.renderUsers() }
          </tbody>
        </table>
      </div>
    );
  }
}
