import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { checkAdminRole } from 'utils/routing';
import { routeCodes } from '../../routes';

@connect(state => ({
  loggedInUser: state.login.get('loggedInUser'),
}))
export default class Dashboard extends Component {
  static propTypes = {
    loggedInUser: PropTypes.object,
  }

  componentWillMount() {
    const { loggedInUser } = this.props;
    checkAdminRole(loggedInUser && loggedInUser.role);
  }

  render() {
    return (
      <div className='Dashboard Admin-wrapper'>
        <h1>Dashboard</h1>
        <div className='AdminDashboard'>
          <Link className='AdminDashboard-link' to={ routeCodes.USERS }>Users</Link>
          <Link className='AdminDashboard-link' to={ routeCodes.CATEGORIES }>Categories</Link>
          <Link className='AdminDashboard-link' to={ routeCodes.CATERINGS }>Caterings</Link>
          <Link className='AdminDashboard-link' to={ routeCodes.DISHES }>Dishes</Link>
          <Link className='AdminDashboard-link' to={ routeCodes.MENUS }>Menus</Link>
          <Link className='AdminDashboard-link' to={ routeCodes.WEEKLY_OVERVIEW }>Weekly Overview</Link>
        </div>
      </div>
    );
  }
}
