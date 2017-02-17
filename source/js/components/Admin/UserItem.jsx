
import React, { Component, PropTypes } from 'react';
import { removeUser } from 'api/users';
import { deleteUserFromAuthDB } from 'api/auth';
import { prepareForReauthentication } from 'utils/reauth';

export default class UserItem extends Component {
  static propTypes = {
    admin: PropTypes.object,
    data: PropTypes.object,
  }

  constructor() {
    super();
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
  }

  handleDeleteClick() {
    const { data, admin } = this.props;
    prepareForReauthentication();
    removeUser(data.uid);
    deleteUserFromAuthDB(data.user, admin);
  }

  render() {
    const { data } = this.props;
    return (
      <tr>
        <td>{ data.user.username }</td>
        <td>{ data.user.email }</td>
        <td>{ data.user.role }</td>
        {/* <td><button className='AdminTable-button'>Edit</button></td> */}
        <td><button onClick={ this.handleDeleteClick } className='AdminTable-button'>Delete</button></td>
      </tr>
    );
  }
}
