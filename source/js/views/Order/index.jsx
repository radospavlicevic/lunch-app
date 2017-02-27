import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { db } from 'utils/firebase_config';
import { addCategory } from 'actions/meals.js';
import { addDishInMenu } from 'actions/menus';
import SideDate from 'components/Client/SideDate';
import MenuSection from 'components/Client/MenuSection';

@connect(state => ({
  loggedInUser: state.login.get('loggedInUser'),
  menus: state.menus.get('menus'),
  categories: state.meals.get('categories'),
  standardDishes: state.meals.get('standardDishes'),
  selectedDate: state.order.get('selectedDate'),
}))
export default class Order extends Component {
  static propTypes = {
    loggedInUser: PropTypes.object,
    categories: PropTypes.object,
    menus: PropTypes.object,
    selectedDate: PropTypes.string,
    standardDishes: PropTypes.object,
    dispatch: PropTypes.func,
  }

  componentWillMount() {
    console.log(this.props.standardDishes);
    this.setupFirebaseObservers();
  }

  componentWillReceiveProps(nextProps) {
    const { selectedDate } = this.props;
    if (selectedDate !== nextProps.selectedDate) {
      this.updateFirebaseObservers(nextProps.selectedDate);
    }
  }

  setupFirebaseObservers() {
    const { selectedDate, dispatch } = this.props;

    db.ref('categories').on('child_added', newCategory => {
      dispatch(addCategory(newCategory.key, newCategory.val().name));
    });

    db.ref(`menus/${ selectedDate }`).on('child_added', newMenuDish => {
      dispatch(
        addDishInMenu(selectedDate, newMenuDish.key, newMenuDish.val())
      );
    });
  }

  updateFirebaseObservers(selectedDate) {
    const { dispatch } = this.props;

    db.ref(`menus/${ selectedDate }`).on('child_added', newMenuDish => {
      dispatch(
        addDishInMenu(selectedDate, newMenuDish.key, newMenuDish.val())
      );
    });
  }

  filterByCategory(dishes, category) {
    if (!dishes) {
      return null;
    }
    const filteredDishes = {};

    Object.keys(dishes).forEach((key) => {
      if (dishes[key].category === category) {
        filteredDishes[key] = dishes[key];
      }
    });

    return filteredDishes;
  }

  renderMenuSections() {
    const { menus, categories, selectedDate } = this.props;
    return Object.keys(categories).map((key, index) => {
      return (
        <MenuSection
          key={ index }
          dishes={ this.filterByCategory(menus[selectedDate], key) }
          category={
          { key, name: categories[key].name }
          }
        />
      );
    });
  }

  render() {
    const { loggedInUser } = this.props;
    return (
      <div className='Order'>
        <SideDate />
        { loggedInUser &&
          <div className='MyOrder-wrapper'>
            { this.renderMenuSections() }
          </div>
        }
      </div>
    );
  }
}
