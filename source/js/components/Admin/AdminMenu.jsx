import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import { connect } from 'react-redux';
import { routeCodes } from '../../routes';

@connect(state => ({
  loggedInUser: state.login.get('loggedInUser'),
}))
export default class AdminMenu extends Component {
  static propTypes = {
    loggedInUser: PropTypes.object,
  }

  render() {
    return (
      <div className='AdminMenu-wrapper'>
        <Drawer className='AdminMenu' open={ true }>
          <h2>Admin</h2>
          <Link className='AdminMenu-link' activeClassName='AdminMenu-link--active' to={ routeCodes.MENUS }><MenuItem>Menus</MenuItem></Link>
          <Link className='AdminMenu-link' activeClassName='AdminMenu-link--active' to={ routeCodes.DISHES }><MenuItem>Dishes</MenuItem></Link>
          <Link className='AdminMenu-link' activeClassName='AdminMenu-link--active' to={ routeCodes.CATEGORIES }><MenuItem>Categories</MenuItem></Link>
          <Link className='AdminMenu-link' activeClassName='AdminMenu-link--active' to={ routeCodes.CATERINGS }><MenuItem>Caterings</MenuItem></Link>
          <Link className='AdminMenu-link' activeClassName='AdminMenu-link--active' to={ routeCodes.USERS }><MenuItem>Users</MenuItem></Link>
          <Link className='AdminMenu-link' activeClassName='AdminMenu-link--active' to={ routeCodes.WEEKLY_OVERVIEW }><MenuItem>Weekly Overview</MenuItem></Link>
          <Link className='AdminMenu-link' activeClassName='AdminMenu-link--active' to={ routeCodes.REPORT } target='_blank'><MenuItem>Report</MenuItem></Link>
          <Link className='AdminMenu-link' activeClassName='AdminMenu-link--active' to={ routeCodes.EXPORT }><MenuItem>Export</MenuItem></Link>
        </Drawer>
      </div>
    );
  }
}
