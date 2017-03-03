import React, { Component, PropTypes } from 'react';
import SideDate from 'components/Client/SideDate';
import MealOverview from 'components/Client/MealOverview';
import { connect } from 'react-redux';
import { db } from 'utils/firebase_config';
import { userSignedIn } from 'api/auth';
import { addOrUpdateCategory, addOrUpdateDish } from 'actions/meals';
import { addDishInMenu } from 'actions/menus';
import { updateOrder } from 'actions/orders';

@connect(state => ({
  loggedInUser: state.login.get('loggedInUser'),
  menus: state.menus.get('menus'),
  categories: state.meals.get('categories'),
  standardDishes: state.meals.get('standardDishes'),
  selectedDate: state.orders.get('selectedDate'),
  orders: state.orders.get('orders'),
}))
export default class Overview extends Component {
  static propTypes = {
    loggedInUser: PropTypes.object,
    categories: PropTypes.object,
    menus: PropTypes.object,
    selectedDate: PropTypes.string,
    orders: PropTypes.object,
    standardDishes: PropTypes.object,
    dispatch: PropTypes.func,
  }

  componentWillMount() {
    this.setupFirebaseObservers();
  }

  componentWillReceiveProps(nextProps) {
    const { selectedDate, loggedInUser, dispatch } = this.props;
    if (selectedDate !== nextProps.selectedDate) {
      this.updateFirebaseObservers(nextProps.selectedDate);
    }
    if (loggedInUser !== nextProps.loggedInUser && nextProps.loggedInUser) {
      db.ref(`orders/${ selectedDate }/${ userSignedIn().uid }`).on('value', order => {
        dispatch(updateOrder(selectedDate, order.key, order.val()));
      });
    }
  }

  setupFirebaseObservers() {
    const { selectedDate, dispatch } = this.props;

    db.ref('categories').on('child_added', newCategory => {
      dispatch(addOrUpdateCategory(newCategory.key, newCategory.val().name));
    });

    db.ref(`menus/${ selectedDate }`).on('child_added', newMenuDish => {
      dispatch(
        addDishInMenu(selectedDate, newMenuDish.key, newMenuDish.val())
      );
    });

    db.ref('dishes').on('child_added', newDish => {
      dispatch(addOrUpdateDish(newDish.key, newDish.val()));
    });
  }

  getOrder(loggedInUser, selectedDate, orders) {
    const mealItems = [];
    const { menus, categories, standardDishes } = this.props;
    if (loggedInUser && orders[selectedDate] && orders[selectedDate][userSignedIn().uid]) {
      const { meal, note } = orders[selectedDate][userSignedIn().uid];
      Object.keys(meal).forEach(key => {
        mealItems.push({
          category: categories[key].name,
          dish: menus[selectedDate][meal[key]] || standardDishes[meal[key]],
        });
      });
      return {
        mealItems,
        note,
      };
    }
    return null;
  }

  updateFirebaseObservers(selectedDate) {
    const { dispatch } = this.props;

    db.ref(`menus/${ selectedDate }`).on('child_added', newMenuDish => {
      dispatch(
        addDishInMenu(selectedDate, newMenuDish.key, newMenuDish.val())
      );
    });

    db.ref(`orders/${ selectedDate }/${ userSignedIn().uid }`).on('value', order => {
      dispatch(updateOrder(selectedDate, order.key, order.val()));
    });
  }

  render() {
    const { loggedInUser, selectedDate, orders } = this.props;
    const order = this.getOrder(loggedInUser, selectedDate, orders);
    return (
      <div className='Overview'>
        { loggedInUser && <SideDate /> }
        { loggedInUser &&
        <div className='Overview-top'>
          <h1 className='Overview-userName'>{ loggedInUser.username }&apos;s orders: </h1>
          <h1 className='Overview-selectedDate'>{ selectedDate }</h1>
          { (loggedInUser && order) && <MealOverview data={ order } /> }
        </div>
        }
      </div>
    );
  }
}
