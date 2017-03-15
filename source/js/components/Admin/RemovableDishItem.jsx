
import React, { Component, PropTypes } from 'react';
import FlatButton from 'material-ui/FlatButton';
import { TableRow, TableRowColumn } from 'material-ui/Table';
import { deleteDishFromMenu } from 'api/menus';
import { connect } from 'react-redux';

@connect()
export default class RemovableDishItem extends Component {
  static propTypes = {
    dishKey: PropTypes.string,
    dishData: PropTypes.object,
    lunchDay: PropTypes.string,
    // dispatch: PropTypes.func,
  }

  constructor() {
    super();

    this.handleDeleteClick = this.handleDeleteClick.bind(this);
  }

  handleDeleteClick() {
    const { dishKey, lunchDay } = this.props;
    deleteDishFromMenu(lunchDay, dishKey);
  }

  render() {
    const { dishData } = this.props;
    return (
      <TableRow className='DishItem'>
        <TableRowColumn>{ dishData.name }</TableRowColumn>
        <TableRowColumn>{ dishData.description }</TableRowColumn>
        <TableRowColumn>{ dishData.price ? dishData.price : 0 } din</TableRowColumn>
        <TableRowColumn>
          <FlatButton label='Delete' primary={ true } onClick={ this.handleDeleteClick } />
        </TableRowColumn>
      </TableRow>
    );
  }
}
