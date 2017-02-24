import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { db } from 'utils/firebase_config';
import { addCatering, addCategory, addOrUpdateDish } from 'actions/meals.js';
import { routeCodes } from '../../routes';

@connect()
export default class Dashboard extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
  }

  componentWillMount() {
    this.setupFirebaseObservers();
  }

  setupFirebaseObservers() {
    const { dispatch } = this.props;
    db.ref('caterings').on('child_added', newCatering => {
      dispatch(addCatering(newCatering.key, newCatering.val()));
    });

    db.ref('categories').on('child_added', newCategory => {
      dispatch(addCategory(newCategory.key, newCategory.val().name));
    });

    db.ref('dishes').on('child_added', newDish => {
      dispatch(addOrUpdateDish(newDish.key, newDish.val()));
    });

    db.ref('dishes').on('child_changed', updatedDish => {
      dispatch(addOrUpdateDish(updatedDish.key, updatedDish.val()));
    });
  }

  render() {
    return (
      <div className='Dashboard Admin-wrapper'>
        <h1>Dashboard</h1>
        <div className='AdminDashboard'>
          <div className='AdminDashboard-item'><Link to={ routeCodes.USERS }>Users</Link></div>
          <div className='AdminDashboard-item'><Link to={ routeCodes.CATEGORIES }>Categories</Link></div>
          <div className='AdminDashboard-item'><Link to={ routeCodes.CATERINGS }>Caterings</Link></div>
          <div className='AdminDashboard-item'><Link to={ routeCodes.DISHES }>Dishes</Link></div>
          <div className='AdminDashboard-item'><Link to={ routeCodes.MENUS }>Menus</Link></div>
          <div className='AdminDashboard-item'><Link to='#'>Daily Overview</Link></div>
        </div>
      </div>
    );
  }
}
