import React, { Component } from 'react';
import { Link } from 'react-router';
import { routeCodes } from '../../routes';

export default class Dashboard extends Component {
  static propTypes = {
  }

  render() {
    return (
      <div className='Dashboard'>
        <h1>Dashboard</h1>
        <div className='AdminDashboard'>
          <div className='AdminDashboard-item'><Link to={ routeCodes.USERS }>Users</Link></div>
          <div className='AdminDashboard-item'><Link to={ routeCodes.MEALS }>Meals</Link></div>
          <div className='AdminDashboard-item'><Link to='#'>Caterings</Link></div>
          <div className='AdminDashboard-item'><Link to='#'>Menus</Link></div>
        </div>
      </div>
    );
  }
}
