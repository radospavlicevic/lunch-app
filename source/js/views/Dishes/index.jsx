import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { db } from 'utils/firebase_config';
import AdminMenu from 'components/Admin/AdminMenu';
import DishForm from 'components/Admin/DishForm';
import DishOverview from 'components/Admin/DishOverview';
import { addOrUpdateDish, deleteDish, addOrUpdateCategory, addOrUpdateCatering } from 'actions/meals.js';
import { deleteDishFromMenu, updateDishInMenu } from 'api/menus.js';
import { dishOverviewTypes } from 'utils/globals';
import CheckAdminRole from '../../decorators/AuthorizationDecorator';

@CheckAdminRole
@connect(state => ({
  caterings: state.meals.get('caterings'),
  categories: state.meals.get('categories'),
  dishes: state.meals.get('dishes'),
  menus: state.menus.get('menus'),
}))
export default class Dishes extends Component {

  static propTypes = {
    caterings: PropTypes.object,
    categories: PropTypes.object,
    dishes: PropTypes.object,
    menus: PropTypes.object,
    dispatch: PropTypes.func,
  }

  componentWillMount() {
    this.setupFirebaseObservers();
    document.title = 'Dishes, Admin - Yummy Yumzor';
  }

  setupFirebaseObservers() {
    const { dispatch } = this.props;

    db.ref('dishes').on('child_changed', updatedDish => {
      dispatch(addOrUpdateDish(updatedDish.key, updatedDish.val()));
      this.cascadeUpdate(updatedDish.key, updatedDish.val());
    });

    db.ref('dishes').on('child_removed', removedDish => {
      dispatch(deleteDish(removedDish.key));
      this.cascadeDelete(removedDish.key);
    });

    db.ref('caterings').on('child_added', newCatering => {
      dispatch(addOrUpdateCatering(newCatering.key, newCatering.val()));
    });

    db.ref('categories').on('child_added', newCategory => {
      dispatch(addOrUpdateCategory(newCategory.key, newCategory.val().name));
    });
  }

  cascadeUpdate(dishKey, dishData) {
    const { menus } = this.props;
    Object.keys(menus).forEach(date => {
      if (menus[date][dishKey]) {
        updateDishInMenu(date, dishKey, dishData);
      }
    });
  }

  cascadeDelete(dishKey) {
    const { menus } = this.props;
    Object.keys(menus).forEach(key => {
      if (menus[key][dishKey]) {
        deleteDishFromMenu(key, dishKey);
      }
    });
  }

  render() {
    const { caterings, categories, dishes } = this.props;
    return (
      <div className='Admin-wrapper'>
        <AdminMenu />
        <div className='Dishes'>
          <DishForm caterings={ caterings } categories={ categories } />
          <DishOverview
            type={ dishOverviewTypes.EDITABLE }
            caterings={ caterings }
            categories={ categories }
            dishes={ dishes }
          />
        </div>
      </div>
    );
  }
}
