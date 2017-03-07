import React, { Component, PropTypes } from 'react';
import DailyTableRow from 'components/Admin/DailyTableRow';

export default class DailyTable extends Component {
  static propTypes = {
    selectedDate: PropTypes.string,
    categories: PropTypes.object,
    orders: PropTypes.array,
  }

  rowData(order) {
    const { categories } = this.props;
    if (!order) return null;
    const dishes = [];
    Object.keys(categories).forEach(key => {
      dishes.push(!(order.dishes && order.dishes[key]) ? '' : order.dishes[key]);
    });

    const data = {
      name: order.name,
      note: order.note ? order.note : '-',
      dishes,
    };
    return data;
  }

  renderHeaderCategories() {
    const { categories } = this.props;
    return Object.keys(categories).map((key, index) => {
      return <th key={ index }>{ categories[key].name }</th>;
    });
  }

  renderOrderRows() {
    const { orders, selectedDate } = this.props;
    if (!orders) return null;
    return orders.map((order, index) => {
      return (
        <DailyTableRow
          key={ index }
          selectedDate={ selectedDate }
          uid={ order.uid }
          data={ this.rowData(order) }
          canceled={ order.canceled }
        />
      );
    });
  }

  render() {
    const { selectedDate } = this.props;
    return (
      <div className='DailyTable'>
        <h1>All Orders for: { selectedDate }</h1>
        <table className='AdminTable table'>
          <thead className='thead-inverse'>
            <tr>
              <th>Ime</th>
              { this.renderHeaderCategories() }
              <th>Napomena</th>
              <th />
            </tr>
          </thead>
          <tbody>
            { this.renderOrderRows() }
          </tbody>
        </table>
        <span>* Standardni meni</span>
      </div>
    );
  }

}
