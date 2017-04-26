import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { db } from 'utils/firebase_config';
import ReportDatePicker from 'components/Global/ReportDatePicker';
import DailyTable from 'components/Admin/DailyTable';
import { updateOrder, cancelOrder } from 'actions/orders';
import { addOrUpdateUser } from 'actions/users';
import { addOrUpdateCategory, addOrUpdateDishes } from 'actions/meals';
import { addOrUpdateMenu } from 'actions/menus';

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
    dispatch: PropTypes.func,
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
    const { reportDate, dispatch } = this.props;

    db.ref('users').on('child_added', newUser => {
      dispatch(addOrUpdateUser(newUser.key, newUser.val()));
    });

    db.ref('categories').on('child_added', newCategory => {
      dispatch(addOrUpdateCategory(newCategory.key, newCategory.val().name));
    });

    db.ref(`menus/${ reportDate }`).on('value', currentMenu => {
      dispatch(addOrUpdateMenu(reportDate, currentMenu.key, currentMenu.val()));
    });

    db.ref(`orders/${ reportDate }`).on('child_added', order => {
      dispatch(updateOrder(reportDate, order.key, order.val()));
    });

    db.ref(`orders/${ reportDate }`).on('child_removed', order => {
      dispatch(cancelOrder(reportDate, order.key));
    });

    db.ref('dishes').on('value', dishes => {
      dispatch(addOrUpdateDishes(dishes.val()));
    });
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
    const { dispatch } = this.props;

    db.ref(`menus/${ reportDate }`).on('value', currentMenu => {
      dispatch(addOrUpdateMenu(reportDate, currentMenu.key, currentMenu.val()));
    });

    db.ref(`orders/${ reportDate }`).on('child_added', order => {
      dispatch(updateOrder(reportDate, order.key, order.val()));
    });

    db.ref(`orders/${ reportDate }`).on('child_removed', order => {
      dispatch(cancelOrder(reportDate, order.key));
    });
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
