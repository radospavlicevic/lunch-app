import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import ReportDatePicker from 'components/Global/ReportDatePicker';
import DailyTable from 'components/Admin/DailyTable';
import { loadOrders } from 'actions/orders';
import { loadUsers } from 'actions/users';
import { loadCategories, loadDishes } from 'actions/meals';
import { addOrUpdateMenu } from 'actions/menus';
import { observableModule } from 'components/Observable/ObservableModule';

@connect(state => ({
  menus: state.menus.get('menus'),
  categories: state.meals.get('categories'),
  standardDishes: state.meals.get('standardDishes'),
  reportDate: state.orders.get('reportDate'),
  orders: state.orders.get('orders'),
  users: state.users.get('users'),
}))
export default class Report extends Component {
  static propTypes = {
    reportDate: PropTypes.string,
    menus: PropTypes.object,
    standardDishes: PropTypes.object,
    categories: PropTypes.object,
    orders: PropTypes.object,
    users: PropTypes.object,
  }

  componentWillMount() {
    this.setupFirebaseObservers();
    document.title = 'Report - Yummy Yumzor';
  }

  componentWillReceiveProps(nextProps) {
    const { reportDate } = this.props;
    if (reportDate !== nextProps.reportDate) {
      this.updateFirebaseObservers(nextProps.reportDate);
    }
  }

  setupFirebaseObservers() {
    const { reportDate } = this.props;

    observableModule.addValueObserver('users', loadUsers);
    observableModule.addValueObserver('dishes', loadDishes);
    observableModule.addValueObserver('categories', loadCategories);
    observableModule.addValueObserver(`menus/${ reportDate }`, addOrUpdateMenu, 2);
    observableModule.addValueObserver(`orders/${ reportDate }`, loadOrders, 2);
  }

  getUserOrderedDishes(uid) {
    const { reportDate, orders, menus, standardDishes } = this.props;
    if (!orders[reportDate][uid]) return null;
    if (!orders[reportDate][uid].meal) return null;
    const dishes = {};
    const { meal } = orders[reportDate][uid];
    Object.keys(meal).forEach(key => {
      dishes[key] = menus[reportDate][meal[key]] || standardDishes[meal[key]];
    });
    return dishes;
  }

  updateFirebaseObservers(reportDate) {
    observableModule.addValueObserver(`menus/${ reportDate }`, addOrUpdateMenu, 2);
    observableModule.addValueObserver(`orders/${ reportDate }`, loadOrders, 2);
  }

  tableOrders() {
    const { reportDate, orders, users } = this.props;
    if (!orders[reportDate]) return null;
    const orderData = [];
    Object.keys(users).forEach(key => {
      orderData.push({
        uid: key,
        name: users[key].username,
        canceled: !orders[reportDate][key],
        dishes: this.getUserOrderedDishes(key),
        note: orders[reportDate][key] && orders[reportDate][key].note,
      });
    });
    return orderData;
  }

  render() {
    const { reportDate, categories, standardDishes } = this.props;
    return (
      <div className='Report'>
        <h2>Izveštaj</h2>
        <ReportDatePicker reportDate={ reportDate } />
        <DailyTable
          selectedDate={ reportDate }
          categories={ categories }
          orders={ this.tableOrders() }
          standardDishes={ standardDishes }
          locked={ true }
        />
      </div>
    );
  }
}
