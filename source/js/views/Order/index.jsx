import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { db } from 'utils/firebase_config';
import { userSignedIn } from 'api/auth';
import { saveNoteInOrder } from 'api/orders';
import { updateOrder } from 'actions/orders';
import { addOrUpdateCategory, addOrUpdateDish } from 'actions/meals';
import { addDishInMenu } from 'actions/menus';
import SideDate from 'components/Client/SideDate';
import MenuSection from 'components/Client/MenuSection';

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

    this.handleSaveNoteClick = this.handleSaveNoteClick.bind(this);
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

  handleSaveNoteClick() {
    const { selectedDate } = this.props;
    saveNoteInOrder(selectedDate, this.noteInput.value);
    this.noteInput.value = '';
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

  renderMenuSections() {
    const { menus, categories, selectedDate, orders } = this.props;
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

  render() {
    const { loggedInUser, selectedDate } = this.props;
    return (
      <div className='Order'>
        { loggedInUser && <SideDate /> }
        { loggedInUser &&
          <div className='MyOrder-wrapper'>
            <span className='Order-label'>Hello, { loggedInUser.username } <br />
              Choose your meal for { selectedDate }
            </span>
            { this.renderMenuSections() }
            <div className='Order-noteSection'>
              <textarea
                placeholder='Note...'
                className='Order-noteInput'
                ref={ node => this.noteInput = node }
              />
              <button onClick={ this.handleSaveNoteClick } className='Order-noteButton'>Save Note</button>
            </div>
          </div>
        }
      </div>
    );
  }
}
