
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { updateRole, removeUser } from 'api/users';
import { roles } from 'utils/globals';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import { TableRow, TableRowColumn } from 'material-ui/Table';

@connect()
export default class UserItem extends Component {
  static propTypes = {
    user: PropTypes.object,
  }

  constructor() {
    super();

    this.handleDeleteClick = this.handleDeleteClick.bind(this);
    this.handleRoleChange = this.handleRoleChange.bind(this);
  }

  handleDeleteClick() {
    const { user } = this.props;
    removeUser(user.uid);
  }

  handleRoleChange(event, index, value) {
    const { user } = this.props;
    updateRole(user.uid, value);
  }

  render() {
    const { user } = this.props;
    return (
      <TableRow>
        <TableRowColumn>{ user.data.username }</TableRowColumn>
        <TableRowColumn>{ user.data.email }</TableRowColumn>
        <TableRowColumn style={ { width: '15%' } }>
          <SelectField
            className='TableCell-select'
            value={ user.data.role }
            onChange={ this.handleRoleChange }
            fullWidth={ true }
          >
            <MenuItem value={ roles.USER } primaryText={ roles.USER } />
            <MenuItem value={ roles.ADMIN } primaryText={ roles.ADMIN } />
          </SelectField>
        </TableRowColumn>
        <TableRowColumn style={ { width: '15%' } }>
          <FlatButton label='Delete' primary={ true } onClick={ this.handleDeleteClick } />
        </TableRowColumn>
      </TableRow>
    );
  }
}
