import React, { Component, PropTypes } from 'react';
import DailyTableRow from 'components/Admin/DailyTableRow';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow } from 'material-ui/Table';

export default class DailyTable extends Component {
  static propTypes = {
    selectedDate: PropTypes.string,
    categories: PropTypes.object,
    orders: PropTypes.array,
    locked: PropTypes.bool,
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
      return <TableHeaderColumn key={ index }>{ categories[key].name }</TableHeaderColumn>;
    });
  }

  renderOrderRows() {
    const { orders, selectedDate, locked } = this.props;
    if (!orders) return null;
    return orders.map((order, index) => {
      return (
        <DailyTableRow
          key={ index }
          selectedDate={ selectedDate }
          uid={ order.uid }
          data={ this.rowData(order) }
          canceled={ order.canceled }
          locked={ locked }
        />
      );
    });
  }

  render() {
    const { selectedDate, locked } = this.props;
    return (
      <div className='DailyTable'>
        <h1>All Orders for: { selectedDate }</h1>
        <Table>
          <TableHeader
            displaySelectAll={ false }
            adjustForCheckbox={ false }
          >
            <TableRow>
              <TableHeaderColumn>Ime</TableHeaderColumn>
              { this.renderHeaderCategories() }
              <TableHeaderColumn>Napomena</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody>
            { this.renderOrderRows() }
          </TableBody>
        </Table>
        <p>* Standardni meni</p>
      </div>
    );
  }

}
