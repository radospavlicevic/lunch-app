import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { removeDish } from 'api/meals.js';
import { addOrUpdateCategory, deleteCategory, countCategories } from 'actions/meals.js';
import { db } from 'utils/firebase_config';
import CategoryForm from 'components/Admin/CategoryForm';
import CategoryOverview from 'components/Admin/CategoryOverview';
import AdminMenu from 'components/Admin/AdminMenu';
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
    dispatch: PropTypes.func,
  }

  componentWillMount() {
    this.setupFirebaseObservers();
    document.title = 'Categories, Admin - Yummy Yumzor';
  }

  setupFirebaseObservers() {
    const { dispatch } = this.props;
    db.ref('categories').on('value', snapshot => {
      dispatch(countCategories(snapshot.numChildren()));
    });

    db.ref('categories').on('child_added', newCategory => {
      dispatch(addOrUpdateCategory(newCategory.key, newCategory.val().name));
    });

    db.ref('categories').on('child_changed', newCategory => {
      dispatch(addOrUpdateCategory(newCategory.key, newCategory.val().name));
    });

    db.ref('categories').on('child_removed', removedCategory => {
      dispatch(deleteCategory(removedCategory.key));
      this.cascadeDelete(removedCategory.key);
    });
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
