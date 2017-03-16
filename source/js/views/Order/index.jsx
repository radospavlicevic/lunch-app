import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { db } from 'utils/firebase_config';
import { userSignedIn } from 'api/auth';
import { saveNoteInOrder, deleteUserOrder } from 'api/orders';
import { updateOrder } from 'actions/orders';
import { addOrUpdateCategory, addOrUpdateDish } from 'actions/meals';
import { addDishInMenu } from 'actions/menus';
import SideDate from 'components/Client/SideDate';
import MenuSection from 'components/Client/MenuSection';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

@connect(state => ({
  loggedInUser: state.login.get('loggedInUser'),
  menus: state.menus.get('menus'),
  categories: state.meals.get('categories'),
  standardDishes: state.meals.get('standardDishes'),
  selectedDate: state.orders.get('selectedDate'),
  orders: state.orders.get('orders'),
}))
export default class Order extends Component {
  static propTypes = {
    loggedInUser: PropTypes.object,
    categories: PropTypes.object,
    menus: PropTypes.object,
    selectedDate: PropTypes.string,
    standardDishes: PropTypes.object,
    orders: PropTypes.object,
    dispatch: PropTypes.func,
  }

  constructor() {
    super();

    this.handleNoteChange = this.handleNoteChange.bind(this);
    this.handleCancelLunchClick = this.handleCancelLunchClick.bind(this);
  }

  componentWillMount() {
    this.state = {
      note: '',
    };
    this.setupFirebaseObservers();
  }

  componentWillReceiveProps(nextProps) {
    const { selectedDate, loggedInUser, dispatch } = this.props;
    if (selectedDate !== nextProps.selectedDate) {
      this.updateFirebaseObservers(nextProps.selectedDate);
      document.title = `Order, ${ selectedDate } - Yummy Yumzor`;
    }
    if (loggedInUser !== nextProps.loggedInUser && nextProps.loggedInUser) {
      db.ref(`orders/${ selectedDate }/${ userSignedIn().uid }`).on('value', order => {
        dispatch(updateOrder(selectedDate, order.key, order.val()));
      });
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timeoutID);
    this.timeoutID = null;
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

    if (userSignedIn()) {
      db.ref(`orders/${ selectedDate }/${ userSignedIn().uid }`).on('value', order => {
        dispatch(updateOrder(selectedDate, order.key, order.val()));
      });
    }
  }

  getUserFirstName() {
    const { loggedInUser } = this.props;
    return loggedInUser.username.split(' ', 1);
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

  handleNoteChange(event, value) {
    clearTimeout(this.timeoutID);
    this.timeoutID = setTimeout(() => {
      const { selectedDate } = this.props;
      saveNoteInOrder(selectedDate, value);
    }, 800);
    this.setState({
      note: value,
    });
  }

  handleCancelLunchClick() {
    const { selectedDate } = this.props;
    deleteUserOrder(selectedDate, userSignedIn().uid);
  }

  filterByCategory(dishes, category) {
    const { standardDishes } = this.props;
    if (!dishes) {
      return (category === 'main_dish') ? standardDishes : null;
    }
    const filteredDishes = {};

    Object.keys(dishes).forEach((key) => {
      if (dishes[key].category === category) {
        filteredDishes[key] = dishes[key];
      }
    });

    return (category !== 'main_dish') ? filteredDishes : Object.assign({}, filteredDishes, standardDishes);
  }

  menuIsLocked(selectedDate) {
    const { menus } = this.props;
    return menus[selectedDate] && menus[selectedDate].locked;
  }

  emptyMenu(selectedDate) {
    const { menus } = this.props;
    if (menus[selectedDate]) {
      return (Object.keys(menus[selectedDate]).length === 0) ||
              (Object.keys(menus[selectedDate]).length === 1 &&
              menus[selectedDate].locked !== undefined);
    }
    return false;
  }

  renderMenuSections(selectedDate) {
    const { menus, categories, orders } = this.props;
    return Object.keys(categories).map((key, index) => {
      return (
        <MenuSection
          key={ index }
          dishes={ this.filterByCategory(menus[selectedDate], key) }
          category={
            { key, name: categories[key].name }
          }
          selectedDate={ selectedDate }
          orders={ orders }
        />
      );
    });
  }

  renderLockedScreen(selectedDate) {
    return (
      <div className='Order-locked'>
        <span>Lunch ordering for { selectedDate } is locked.</span>
      </div>
    );
  }

  renderNoMenuScreen() {
    return (
      <div className='Order-locked'>
        <span>There is no menu for this day yet.</span>
      </div>
    );
  }

  renderUnlockedScreen(selectedDate) {
    return (
      <div>
        <div className='Order-label'>
          <p>Hello, { this.getUserFirstName() }</p>
          <p>Choose your meal for { selectedDate }</p>
        </div>
        { this.renderMenuSections(selectedDate) }
        <div className='Order-noteSection'>
          <TextField
            style={ { maxWidth: 500, width: '100%' } }
            floatingLabelText='Note'
            multiLine={ true }
            className='Order-note'
            value={ this.state.note }
            onChange={ this.handleNoteChange }
          />
        </div>
        <div className='Order-cancelLunch'>
          <RaisedButton
            secondary={ true }
            style={ { maxWidth: 500 } }
            onClick={ this.handleCancelLunchClick }
            className='Order-cancelLunchButton'
            label={ 'Cancel Lunch' }
          />
        </div>
      </div>
    );
  }

  renderMyOrderSide(selectedDate) {
    const { menus } = this.props;
    if (!menus[selectedDate] || this.emptyMenu(selectedDate)) {
      return this.renderNoMenuScreen(selectedDate);
    } else if (this.menuIsLocked(selectedDate)) {
      return this.renderLockedScreen(selectedDate);
    }
    return this.renderUnlockedScreen(selectedDate);
  }

  render() {
    const { loggedInUser, selectedDate } = this.props;
    return (
      <div className='Order'>
        { loggedInUser && <SideDate selectedDate={ selectedDate } /> }
        { loggedInUser &&
          <div className='MyOrder-wrapper'>
            { this.renderMyOrderSide(selectedDate) }
          </div>
        }
      </div>
    );
  }
}
