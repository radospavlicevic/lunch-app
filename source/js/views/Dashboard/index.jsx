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
          <div className='AdminDashboard-item'><Link to='#'>Add food</Link></div>
          <div className='AdminDashboard-item'><Link to='#'>Create menu</Link></div>
          <div className='AdminDashboard-item'><Link to='#'>Add catering</Link></div>
        </div>
      </div>
    );
  }
}
