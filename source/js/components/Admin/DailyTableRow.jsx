
import React, { Component, PropTypes } from 'react';
import { deleteUserOrder } from 'api/orders';
import { TableRow, TableRowColumn } from 'material-ui/Table';
import FlatButton from 'material-ui/FlatButton';

export default class DailyTableRow extends Component {
  static propTypes = {
    selectedDate: PropTypes.string,
    uid: PropTypes.string,
    data: PropTypes.object,
    canceled: PropTypes.bool,
    locked: PropTypes.bool,
  }

  constructor() {
    super();

    this.handleCancelClick = this.handleCancelClick.bind(this);
  }

  handleCancelClick() {
    const { selectedDate, uid } = this.props;
    deleteUserOrder(selectedDate, uid);
  }

  resolveDish(dish) {
    if (!dish) return '-';
    if (dish.standard) return `${ dish.name } *`;
    return dish.name;
  }

  renderDishes() {
    const { dishes } = this.props.data;
    return dishes.map((dish, index) => {
      return (
        <TableRowColumn className={ index === 0 ? 'TableCell-mainDish' : '' } key={ index }>
          { this.resolveDish(dish) }
        </TableRowColumn>
      );
    });
  }

  render() {
    const { canceled, data, locked } = this.props;
    return (
      <TableRow className={ canceled ? 'TableRow-canceled' : '' }>
        <TableRowColumn>{ data.name }</TableRowColumn>
        { this.renderDishes() }
        <TableRowColumn>{ data.note }</TableRowColumn>
        { !locked &&
          <TableRowColumn>
            <FlatButton
              label={ canceled ? 'Canceled' : 'Cancel' }
              disabled={ canceled }
              onClick={ this.handleCancelClick }
            />
          </TableRowColumn>
        }
      </TableRow>
    );
  }
}
