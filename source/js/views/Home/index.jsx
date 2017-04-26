import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { db } from 'utils/firebase_config';
import { redirectTo } from 'utils/routing';
import { isPastDate, formatDateSr } from 'utils/globals';
import { userSignedIn } from 'api/auth';
import { updateOrder, setSelectedDate } from 'actions/orders';
import { addOrUpdateCategory } from 'actions/meals';
import { addOrUpdateMenu } from 'actions/menus';
import SideDate from 'components/Client/SideDate';
import Order from 'components/Client/Order';
import CircularProgress from 'material-ui/CircularProgress';
import MealOverview from 'components/Client/MealOverview';

@connect(state => ({
  loggedInUser: state.login.get('loggedInUser'),
  menus: state.menus.get('menus'),
  categories: state.meals.get('categories'),
  standardDishes: state.meals.get('standardDishes'),
  selectedDate: state.orders.get('selectedDate'),
  orders: state.orders.get('orders'),
}))
export default class Home extends Component {
  static propTypes = {
    loggedInUser: PropTypes.object,
    categories: PropTypes.object,
    menus: PropTypes.object,
    standardDishes: PropTypes.object,
    orders: PropTypes.object,
    selectedDate: PropTypes.string,
    params: PropTypes.object,
    dispatch: PropTypes.func,
  }

  componentWillMount() {
    const { params } = this.props;
    this.setupFirebaseObservers();
    document.title = `${ params.state }, ${ params.date } - Yummy Yumzor`;
    if (!params.state && !params.date) {
      document.title = 'Yummy Yumzor';
    }
    if (params.state === 'edit' && isPastDate(params.date)) {
      redirectTo(`/order/${ params.date }/overview`);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { params, selectedDate, loggedInUser, orders, dispatch } = this.props;
    document.title = `${ nextProps.params.state && nextProps.params.state.charAt(0).toUpperCase() + nextProps.params.state.slice(1) },
    ${ params.date } - Yummy Yumzor`;

    if (!nextProps.params.state) {
      document.title = 'Yummy Yumzor';
    }

    if (loggedInUser !== nextProps.loggedInUser && nextProps.loggedInUser) {
      const date = params.date || selectedDate;
      db.ref(`orders/${ date }/${ userSignedIn().uid }`).on('value', order => {
        dispatch(updateOrder(date, order.key, order.val()));
      });
    }

    if (params.date !== nextProps.params.date) {
      const date = nextProps.params.date || selectedDate;
      this.updateFirebaseObservers(date);
      dispatch(setSelectedDate(date));
    }

    if (nextProps.orders !== orders) {
      const date = nextProps.params.date || selectedDate;
      if (!nextProps.params.state) {
        redirectTo(`/order/${ date }/${ this.getHomePageState(nextProps.orders, date) }`);
      }
    }

    if (nextProps.params.state !== params.state) {
      const date = nextProps.params.date || selectedDate;
      if (nextProps.params.state === 'edit' && isPastDate(date)) {
        redirectTo(`/order/${ date }/overview`);
      }
    }
  }

  getUserFirstName() {
    const { loggedInUser } = this.props;
    return loggedInUser && loggedInUser.username.split(' ', 1);
  }

  getOrder(loggedInUser, selectedDate, orders) {
    const mealItems = [];
    const { menus, categories, standardDishes } = this.props;
    if (loggedInUser && orders[selectedDate] && orders[selectedDate][userSignedIn().uid]) {
      const { meal, note } = orders[selectedDate][userSignedIn().uid];
      Object.keys(meal).forEach(key => {
        if (menus[selectedDate][meal[key]] || standardDishes[meal[key]]) {
          const dish = menus[selectedDate][meal[key]] || standardDishes[meal[key]];
          mealItems.push({
            category: categories[key].name,
            dish,
          });
        }
      });
      return {
        mealItems,
        note,
      };
    }
    return null;
  }

  getHomePageState(orders, date) {
    if (isPastDate(date)) {
      return 'overview';
    }
    if (orders[date]
      && orders[date][userSignedIn().uid]
      && orders[date][userSignedIn().uid].meal) {
      return 'overview';
    }
    return 'edit';
  }

  setupFirebaseObservers() {
    const { selectedDate, params, dispatch } = this.props;
    const date = params.date || selectedDate;

    db.ref('categories').on('child_added', newCategory => {
      dispatch(addOrUpdateCategory(newCategory.key, newCategory.val().name));
    });

    db.ref(`menus/${ date }`).on('value', newMenuDish => {
      dispatch(
        addOrUpdateMenu(newMenuDish.key, newMenuDish.val())
      );
    });

    if (userSignedIn()) {
      db.ref(`orders/${ date }/${ userSignedIn().uid }`).on('value', order => {
        dispatch(updateOrder(date, order.key, order.val()));
      });
    }
  }

  updateFirebaseObservers(selectedDate) {
    const { dispatch } = this.props;
    db.ref(`menus/${ selectedDate }`).on('value', newMenuDish => {
      dispatch(addOrUpdateMenu(newMenuDish.key, newMenuDish.val()));
    });

    db.ref(`orders/${ selectedDate }/${ userSignedIn().uid }`).on('value', order => {
      dispatch(updateOrder(selectedDate, order.key, order.val()));
    });
  }

  renderContent(date, orders) {
    const {
      loggedInUser,
      categories,
      standardDishes,
      menus,
      params,
    } = this.props;

    if (params.state === 'overview') {
      return (
        <MealOverview
          date={ date }
          data={ this.getOrder(loggedInUser, date, orders) }
        />
      );
    }
    return (
      <Order
        loggedInUser={ loggedInUser }
        selectedDate={ date }
        categories={ categories }
        standardDishes={ standardDishes }
        menus={ menus }
        orders={ orders }
      />
    );
  }

  render() {
    const {
      loggedInUser,
      selectedDate,
      orders,
      params,
    } = this.props;
    const date = params.date || selectedDate;
    const ordersLoaded = orders && orders[date];

    return (
      <div className='Home'>
        { loggedInUser &&
          <div className='Home-wrapper'>
            <div className='Order-label'>
              <p>Hello, { this.getUserFirstName() }</p>
              { params.state === 'overview' &&
                <p>Your order for { formatDateSr(date) }</p>
              }
              { params.state === 'edit' &&
                <p>Choose your meal for { formatDateSr(date) }</p>
              }
            </div>
            <SideDate
              selectedDate={ date }
              orders={ orders }
            />
            { !ordersLoaded &&
              <div className='Home-loading'>
                <CircularProgress size={ 50 } thickness={ 3 } />
              </div>
            }
            { ordersLoaded && this.renderContent(date, orders) }
          </div>
        }
      </div>
    );
  }
}
