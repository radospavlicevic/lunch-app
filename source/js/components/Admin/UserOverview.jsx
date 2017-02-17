
import React, { Component, PropTypes } from 'react';
import UserItem from './UserItem';

export default class UserOverview extends Component {
  static propTypes = {
    admin: PropTypes.object,
    usersData: PropTypes.array,
  }

  renderUsers() {
    const { admin, usersData } = this.props;
    return usersData && usersData.map((data, index) => {
      return <UserItem key={ index } admin={ admin } data={ data } />;
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
