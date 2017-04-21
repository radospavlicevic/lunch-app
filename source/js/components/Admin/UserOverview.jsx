
import React, { Component, PropTypes } from 'react';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow } from 'material-ui/Table';
import UserItem from './UserItem';

export default class UserOverview extends Component {
  static propTypes = {
    users: PropTypes.object,
  }

  renderUsers() {
    const { users } = this.props;
    return users && Object.keys(users).map((key, index) => {
      return <UserItem key={ index } user={ { uid: key, data: users[key] } } />;
    });
  }

  render() {
    return (
      <div className='UserOverview'>
        <Table
          selectable={ false }
        >
          <TableHeader
            adjustForCheckbox={ false }
            displaySelectAll={ false }
          >
            <TableRow>
              <TableHeaderColumn>Username</TableHeaderColumn>
              <TableHeaderColumn>Email</TableHeaderColumn>
              <TableHeaderColumn style={ { width: '15%' } }>Role</TableHeaderColumn>
              <TableHeaderColumn style={ { width: '15%' } } />
            </TableRow>
          </TableHeader>
          <TableBody
            displayRowCheckbox={ false }
          >
            { this.renderUsers() }
          </TableBody>
        </Table>
      </div>
    );
  }
}
