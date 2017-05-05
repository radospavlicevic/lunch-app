import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { removeDish } from 'api/meals.js';
import { loadCategories, deleteCategory, countCategories } from 'actions/meals.js';
import CategoryForm from 'components/Admin/CategoryForm';
import CategoryOverview from 'components/Admin/CategoryOverview';
import AdminMenu from 'components/Admin/AdminMenu';
import { observableModule } from 'components/Observable/ObservableModule';
import CheckAdminRole from '../../decorators/AuthorizationDecorator';

@CheckAdminRole
@connect(state => ({
  categories: state.meals.get('categories'),
  dishes: state.meals.get('dishes'),
}))
export default class Categories extends Component {

  static propTypes = {
    categories: PropTypes.object,
    dishes: PropTypes.object,
  }

  componentWillMount() {
    this.setupFirebaseObservers();
    document.title = 'Categories, Admin - Yummy Yumzor';
  }

  setupFirebaseObservers() {
    observableModule.addValueCounterObserver('categories', loadCategories, countCategories);
    observableModule.addCascadingObserver('categories', 'child_removed', deleteCategory, this.cascadeDelete.bind(this));
  }

  cascadeDelete(categoryKey) {
    const { dishes } = this.props;
    Object.keys(dishes).forEach(key => {
      if (dishes[key].category === categoryKey) {
        removeDish(key);
      }
    });
  }

  render() {
    const { categories } = this.props;
    return (
      <div className='Admin-wrapper'>
        <AdminMenu />
        <div className='Categories'>
          <CategoryForm />
          <CategoryOverview categories={ categories } />
        </div>
      </div>
    );
  }
}
