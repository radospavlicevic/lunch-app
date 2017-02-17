import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { db } from 'utils/firebase_config';
import { checkAdminRole } from 'utils/routing';
import DishForm from 'components/Admin/DishForm';
import DishOverview from 'components/Admin/DishOverview';
import { deleteDish } from 'actions/meals.js';
import { dishOverviewTypes } from 'utils/globals';

@connect(state => ({
  loggedInUser: state.login.get('loggedInUser'),
  caterings: state.meals.get('caterings'),
  categories: state.meals.get('categories'),
  dishes: state.meals.get('dishes'),
}))
export default class Dishes extends Component {

  static propTypes = {
    loggedInUser: PropTypes.object,
    caterings: PropTypes.object,
    categories: PropTypes.object,
    dishes: PropTypes.object,
    dispatch: PropTypes.func,
  }

  componentWillMount() {
    const { loggedInUser } = this.props;
    checkAdminRole(loggedInUser && loggedInUser.role);
    this.setupFirebaseObservers();
  }

  setupFirebaseObservers() {
    const { dispatch } = this.props;
    db.ref('dishes').on('child_removed', removedDish => {
      dispatch(deleteDish(removedDish.key));
    });
  }

  render() {
    const { caterings, categories, dishes } = this.props;
    return (
      <div className='Dishes'>
        <DishForm caterings={ caterings } categories={ categories } />
        <DishOverview
          type={ dishOverviewTypes.EDITABLE }
          caterings={ caterings }
          categories={ categories }
          dishes={ dishes }
        />
      </div>
    );
  }
}
