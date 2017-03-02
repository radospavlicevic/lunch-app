
import React, { Component, PropTypes } from 'react';
import { removeUser } from 'api/users';
import { deleteUserFromAuthDB } from 'api/auth';
import { prepareForReauthentication } from 'utils/reauth';

export default class UserItem extends Component {
  static propTypes = {
    admin: PropTypes.object,
    user: PropTypes.object,
  }

  constructor() {
    super();
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
  }

  handleDeleteClick() {
    const { user, admin } = this.props;
    prepareForReauthentication();
    removeUser(user.uid);
    deleteUserFromAuthDB(user.data, admin);
  }

  render() {
    const { user } = this.props;

    return (
      <tr>
        <td>{ user.data.username }</td>
        <td>{ user.data.email }</td>
        <td>{ user.data.role }</td>
        {/* <td><button className='AdminTable-button'>Edit</button></td> */}
        <td><button onClick={ this.handleDeleteClick } className='AdminTable-button'>Delete</button></td>
      </tr>
    );
  }
}
