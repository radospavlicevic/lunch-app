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
