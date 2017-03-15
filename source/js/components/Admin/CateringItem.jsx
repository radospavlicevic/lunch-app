import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { removeCatering } from 'api/meals';
import { prepareCateringUpdate } from 'actions/meals';
import FlatButton from 'material-ui/FlatButton';
import { TableRow, TableRowColumn } from 'material-ui/Table';

@connect()
export default class CateringItem extends Component {
  static propTypes = {
    catering: PropTypes.object,
    number: PropTypes.number,
    dispatch: PropTypes.func,
  }

  constructor() {
    super();

    this.handleDeleteClick = this.handleDeleteClick.bind(this);
    this.handleEditClick = this.handleEditClick.bind(this);
  }

  handleDeleteClick() {
    const { catering, number } = this.props;
    if (number > 1) {
      removeCatering(catering.key);
    }
  }

  handleEditClick() {
    const { catering, dispatch } = this.props;

    dispatch(prepareCateringUpdate(
      catering.key, { name: catering.name, contact: catering.contact }
    ));
  }

  render() {
    const { catering } = this.props;
    return (
      <TableRow>
        <TableRowColumn>{ catering.name }</TableRowColumn>
        <TableRowColumn>{ catering.contact }</TableRowColumn>
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
