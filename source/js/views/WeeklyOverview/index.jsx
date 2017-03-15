import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { db } from 'utils/firebase_config';
import WeekPicker from 'components/Global/WeekPicker';
import DailyTable from 'components/Admin/DailyTable';
import { updateOrder, cancelOrder } from 'actions/orders';
import { addUser } from 'actions/users';
import { addOrUpdateCategory, addOrUpdateDish } from 'actions/meals';
import { addDishInMenu } from 'actions/menus';
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
    dispatch: PropTypes.func,
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
    const { selectedDate, dispatch } = this.props;

    db.ref('users').on('child_added', newUser => {
      dispatch(addUser(newUser.key, newUser.val()));
    });

    db.ref('categories').on('child_added', newCategory => {
      dispatch(addOrUpdateCategory(newCategory.key, newCategory.val().name));
    });

    db.ref(`menus/${ selectedDate }`).on('child_added', newMenuDish => {
      dispatch(
        addDishInMenu(selectedDate, newMenuDish.key, newMenuDish.val())
      );
    });

    db.ref(`orders/${ selectedDate }`).on('child_added', order => {
      dispatch(updateOrder(selectedDate, order.key, order.val()));
    });

    db.ref(`orders/${ selectedDate }`).on('child_removed', order => {
      dispatch(cancelOrder(selectedDate, order.key));
    });

    db.ref('dishes').on('child_added', newDish => {
      dispatch(addOrUpdateDish(newDish.key, newDish.val()));
    });
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
    const { dispatch } = this.props;

    db.ref(`menus/${ selectedDate }`).on('child_added', newMenuDish => {
      dispatch(
        addDishInMenu(selectedDate, newMenuDish.key, newMenuDish.val())
      );
    });

    db.ref(`orders/${ selectedDate }`).on('child_added', order => {
      dispatch(updateOrder(selectedDate, order.key, order.val()));
    });

    db.ref(`orders/${ selectedDate }`).on('child_removed', order => {
      dispatch(cancelOrder(selectedDate, order.key));
    });
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
    );
  }
}
