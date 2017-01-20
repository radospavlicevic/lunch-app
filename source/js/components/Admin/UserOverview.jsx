
import React, { Component, PropTypes } from 'react';

export default class UserOverview extends Component {
  static propTypes = {
    users: PropTypes.array,
  }

  render() {
    return (
      <div className='UserOverview'>
        <h1>User Overview</h1>
        <table className='table'>
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
        </table>
      </div>
    );
  }
}
