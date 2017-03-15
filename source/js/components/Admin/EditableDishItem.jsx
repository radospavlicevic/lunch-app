
import React, { Component, PropTypes } from 'react';
import FlatButton from 'material-ui/FlatButton';
import { TableRow, TableRowColumn } from 'material-ui/Table';
import { removeDish } from 'api/meals';
import { prepareDishUpdate } from 'actions/meals';
import { connect } from 'react-redux';

@connect()
export default class EditableDishItem extends Component {
  static propTypes = {
    dishKey: PropTypes.string,
    dishData: PropTypes.object,
    dispatch: PropTypes.func,
  }

  constructor() {
    super();

    this.handleDeleteClick = this.handleDeleteClick.bind(this);
    this.handleEditClick = this.handleEditClick.bind(this);
  }

  handleDeleteClick() {
    const { dishKey } = this.props;
    removeDish(dishKey);
  }

  handleEditClick() {
    const { dishKey, dishData, dispatch } = this.props;
    dispatch(prepareDishUpdate(dishKey, dishData));
    window.scrollTo(0, 0);
  }

  render() {
    const { dishData } = this.props;
    return (
      <TableRow className='DishItem'>
        <TableRowColumn className='u-tableCellName'>{ dishData.name }</TableRowColumn>
        <TableRowColumn className='u-tableCellDesc'>{ dishData.description }</TableRowColumn>
        <TableRowColumn>{ dishData.price ? dishData.price : 0 } din</TableRowColumn>
        <TableRowColumn>
          <FlatButton label='Edit' primary={ true } onClick={ this.handleEditClick } />
        </TableRowColumn>
        <TableRowColumn>
          <FlatButton label='Delete' primary={ true } onClick={ this.handleDeleteClick } />
        </TableRowColumn>
      </TableRow>
    );
  }
}
