
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { removeUser } from 'api/users';
import { prepareUserUpdate } from 'actions/users';
import { deleteUserFromAuthDB } from 'api/auth';
import { prepareForReauthentication } from 'utils/reauth';
import FlatButton from 'material-ui/FlatButton';
import { TableRow, TableRowColumn } from 'material-ui/Table';

@connect()
export default class UserItem extends Component {
  static propTypes = {
    admin: PropTypes.object,
    user: PropTypes.object,
    dispatch: PropTypes.func,
  }

  constructor() {
    super();

    this.handleEditClick = this.handleEditClick.bind(this);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
  }

  handleDeleteClick() {
    const { user, admin } = this.props;
    prepareForReauthentication();
    removeUser(user.uid);
    deleteUserFromAuthDB(user.data, admin);
  }

  handleEditClick() {
    const { user, dispatch } = this.props;
    dispatch(prepareUserUpdate(user.uid, user.data));
    window.scrollTo(0, 0);
  }

  render() {
    const { user } = this.props;
    return (
      <TableRow>
        <TableRowColumn>{ user.data.username }</TableRowColumn>
        <TableRowColumn>{ user.data.email }</TableRowColumn>
        <TableRowColumn style={ { width: '15%' } }>{ user.data.role }</TableRowColumn>
        <TableRowColumn style={ { width: '15%' } }>
          <FlatButton label='Edit' primary={ true } onClick={ this.handleEditClick } />
        </TableRowColumn>
        <TableRowColumn style={ { width: '15%' } }>
          <FlatButton label='Delete' primary={ true } onClick={ this.handleDeleteClick } />
        </TableRowColumn>
      </TableRow>
    );
  }
}
