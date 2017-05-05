import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import WeekPicker from 'components/Global/WeekPicker';
import DailyTable from 'components/Admin/DailyTable';
import AdminMenu from 'components/Admin/AdminMenu';
import { loadOrders } from 'actions/orders';
import { loadUsers } from 'actions/users';
import { loadCategories } from 'actions/meals';
import { addOrUpdateMenu } from 'actions/menus';
import { observableModule } from 'components/Observable/ObservableModule';
import CheckAdminRole from '../../decorators/AuthorizationDecorator';

@CheckAdminRole
@connect(state => ({
  menus: state.menus.get('menus'),
  categories: state.meals.get('categories'),
  standardDishes: state.meals.get('standardDishes'),
  selectedDate: state.orders.get('selectedDate'),
  orders: state.orders.get('orders'),
  users: state.users.get('users'),
}))
export default class WeeklyOverview extends Component {
  static propTypes = {
    selectedDate: PropTypes.string,
    menus: PropTypes.object,
    standardDishes: PropTypes.object,
    categories: PropTypes.object,
    orders: PropTypes.object,
    users: PropTypes.object,
  }

  componentWillMount() {
    this.setupFirebaseObservers();
    document.title = 'Weekly Overview, Admin - Yummy Yumzor';
  }

  componentWillReceiveProps(nextProps) {
    const { selectedDate } = this.props;
    if (selectedDate !== nextProps.selectedDate) {
      this.updateFirebaseObservers(nextProps.selectedDate);
    }
  }

  setupFirebaseObservers() {
    const { selectedDate } = this.props;

    observableModule.addValueObserver('users', loadUsers);
    observableModule.addValueObserver('categories', loadCategories);
    observableModule.addValueObserver(`menus/${ selectedDate }`, addOrUpdateMenu, 2);
    observableModule.addValueObserver(`orders/${ selectedDate }`, loadOrders, 2);
  }

  getUserOrderedDishes(uid) {
    const { selectedDate, orders, menus, standardDishes } = this.props;
    if (!orders[selectedDate][uid]) return null;
    if (!orders[selectedDate][uid].meal) return null;
    const dishes = {};
    const { meal } = orders[selectedDate][uid];
    Object.keys(meal).forEach(key => {
      dishes[key] = menus[selectedDate][meal[key]] || standardDishes[meal[key]];
    });
    return dishes;
  }

  updateFirebaseObservers(selectedDate) {
    observableModule.addValueObserver(`menus/${ selectedDate }`, addOrUpdateMenu, 2);
    observableModule.addValueObserver(`orders/${ selectedDate }`, loadOrders, 2);
  }

  tableOrders() {
    const { selectedDate, orders, users } = this.props;
    if (!orders[selectedDate]) return null;
    const orderData = [];
    Object.keys(users).forEach(key => {
      orderData.push({
        uid: key,
        name: users[key].username,
        canceled: !orders[selectedDate][key],
        dishes: this.getUserOrderedDishes(key),
        note: orders[selectedDate][key] && orders[selectedDate][key].note,
      });
    });
    return orderData;
  }

  render() {
    const { selectedDate, categories, standardDishes } = this.props;
    return (
      <div className='Admin-wrapper'>
        <AdminMenu />
        <div className='WeeklyOverview'>
          <h2>Weekly Overview</h2>
          <WeekPicker selectedDate={ selectedDate } />
          <DailyTable
            selectedDate={ selectedDate }
            categories={ categories }
            orders={ this.tableOrders() }
            standardDishes={ standardDishes }
          />
        </div>
      </div>
    );
  }
}
