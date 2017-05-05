import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import AdminMenu from 'components/Admin/AdminMenu';
import DishForm from 'components/Admin/DishForm';
import DishOverview from 'components/Admin/DishOverview';
import { loadDishes, addOrUpdateDish, deleteDish, loadCaterings, loadCategories } from 'actions/meals.js';
import { deleteDishFromMenu, updateDishInMenu } from 'api/menus.js';
import { dishOverviewTypes } from 'utils/globals';
import { observableModule } from 'components/Observable/observableModule';
import { getDishesSearchSelector } from '../../selectors/dishes';
import CheckAdminRole from '../../decorators/AuthorizationDecorator';

@CheckAdminRole
@connect(state => ({
  caterings: state.meals.get('caterings'),
  categories: state.meals.get('categories'),
  dishes: getDishesSearchSelector(state),
  menus: state.menus.get('menus'),
}))
export default class Dishes extends Component {

  static propTypes = {
    caterings: PropTypes.object,
    categories: PropTypes.object,
    dishes: PropTypes.object,
    menus: PropTypes.object,
  }

  componentWillMount() {
    this.setupFirebaseObservers();
    document.title = 'Dishes, Admin - Yummy Yumzor';
  }

  setupFirebaseObservers() {
    observableModule.addCascadingObserver('dishes', 'child_changed', addOrUpdateDish, this.cascadeUpdate.bind(this));
    observableModule.addCascadingObserver('dishes', 'child_removed', deleteDish, this.cascadeDelete.bind(this));
    observableModule.addValueObserver('dishes', loadDishes);
    observableModule.addValueObserver('caterings', loadCaterings);
    observableModule.addValueObserver('categories', loadCategories);
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
    if (menus) {
      Object.keys(menus).forEach(key => {
        if (menus[key][dishKey]) {
          deleteDishFromMenu(key, dishKey);
        }
      });
    }
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
