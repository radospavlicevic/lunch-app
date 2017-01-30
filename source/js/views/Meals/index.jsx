import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { checkAdminRole } from 'utils/routing';
import CategoryForm from 'components/Admin/CategoryForm';
import CategoryOverview from 'components/Admin/CategoryOverview';

@connect(state => ({
  loggedInUser: state.login.get('loggedInUser'),
  categories: state.meals.get('categories'),
}))
export default class Meals extends Component {

  static propTypes = {
    loggedInUser: PropTypes.object,
    categories: PropTypes.object,
  }

  componentWillMount() {
    const { loggedInUser } = this.props;
    checkAdminRole(loggedInUser && loggedInUser.role);
    // this.setupFirebaseObservers();
  }

  setupFirebaseObservers() {}

  render() {
    // const categories = this.props;
    // console.log(categories);
    return (
      <div className='Meals'>
        <CategoryForm />
        <CategoryOverview />
      </div>
    );
  }
}
