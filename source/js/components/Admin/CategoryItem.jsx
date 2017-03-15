
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { prepareCategoryUpdate } from 'actions/meals';
import { removeCategory } from 'api/meals';
import FlatButton from 'material-ui/FlatButton';
import { TableRow, TableRowColumn } from 'material-ui/Table';

@connect()
export default class CategoryItem extends Component {
  static propTypes = {
    category: PropTypes.object,
    dispatch: PropTypes.func,
  }

  constructor() {
    super();

    this.handleDeleteClick = this.handleDeleteClick.bind(this);
    this.handleEditClick = this.handleEditClick.bind(this);
  }

  handleDeleteClick() {
    const { category } = this.props;
    removeCategory(category.key);
  }

  handleEditClick() {
    const { category, dispatch } = this.props;
    dispatch(prepareCategoryUpdate(category.key, category.name));
  }

  render() {
    const { category } = this.props;
    return (
      <TableRow>
        <TableRowColumn>{ category.name }</TableRowColumn>
        <TableRowColumn className='u-tableCellButton'>
          <FlatButton label='Edit' primary={ true } onClick={ this.handleEditClick } />
        </TableRowColumn>
        <TableRowColumn className='u-tableCellButton'>
          <FlatButton label='Delete' primary={ true } onClick={ this.handleDeleteClick } />
        </TableRowColumn>
      </TableRow>
    );
  }
}
