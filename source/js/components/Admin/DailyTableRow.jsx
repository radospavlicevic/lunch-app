
import React, { Component, PropTypes } from 'react';
import { deleteUserOrder } from 'api/orders';

export default class DailyTableRow extends Component {
  static propTypes = {
    selectedDate: PropTypes.string,
    uid: PropTypes.string,
    data: PropTypes.object,
    canceled: PropTypes.bool,
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
      return <td key={ index }>{ this.resolveDish(dish) }</td>;
    });
  }

  render() {
    const { canceled, data } = this.props;
    return (
      <tr className={ canceled && 'table-danger' }>
        <td>{ data.name }</td>
        { this.renderDishes() }
        <td>{ data.note }</td>
        <td>
          <button onClick={ this.handleCancelClick } disabled={ canceled } className='AdminTable-button'>
            { canceled ? 'Canceled' : 'Cancel' }
          </button>
        </td>
      </tr>
    );
  }
}
