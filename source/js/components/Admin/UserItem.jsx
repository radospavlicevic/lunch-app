
import React, { Component, PropTypes } from 'react';
import { removeUser } from 'api/users';
import { deleteUserFromAuthDB } from 'api/auth';
import { prepareForReauthentication } from 'utils/reauth';
import FlatButton from 'material-ui/FlatButton';
import { TableRow, TableRowColumn } from 'material-ui/Table';

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
      <TableRow>
        <TableRowColumn>{ user.data.username }</TableRowColumn>
        <TableRowColumn>{ user.data.email }</TableRowColumn>
        <TableRowColumn className='u-tableCellButton'>{ user.data.role }</TableRowColumn>
        <TableRowColumn className='u-tableCellButton'>
          <FlatButton label='Delete' primary={ true } onClick={ this.handleDeleteClick } />
        </TableRowColumn>
      </TableRow>
    );
  }
}
