import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { deleteCategory } from 'actions/meals.js';
import { db } from 'utils/firebase_config';
import { checkAdminRole } from 'utils/routing';
import CategoryForm from 'components/Admin/CategoryForm';
import CategoryOverview from 'components/Admin/CategoryOverview';

@connect(state => ({
  loggedInUser: state.login.get('loggedInUser'),
  categories: state.meals.get('categories'),
}))
export default class Categories extends Component {

  static propTypes = {
    loggedInUser: PropTypes.object,
    categories: PropTypes.object,
    dispatch: PropTypes.func,
  }

  componentWillMount() {
    const { loggedInUser } = this.props;
    checkAdminRole(loggedInUser && loggedInUser.role);
    this.setupFirebaseObservers();
  }

  setupFirebaseObservers() {
    const { dispatch } = this.props;
    // db.ref('categories').on('child_added', newCategory => {
    //   dispatch(addCategory(newCategory.key, newCategory.val().name));
    // });

    db.ref('categories').on('child_removed', removedCategory => {
      dispatch(deleteCategory(removedCategory.key));
    });
  }

  render() {
    const { categories } = this.props;
    return (
      <div className='Categories'>
        <CategoryForm />
        <CategoryOverview categories={ categories } />
      </div>
    );
  }
}
