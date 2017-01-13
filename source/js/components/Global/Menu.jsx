import React, { Component, PropTypes } from 'react';
import { IndexLink, Link } from 'react-router';
import { connect } from 'react-redux';
import { roles } from 'utils/routing';
import { routeCodes } from '../../routes';
import { userSignedIn, firebaseLogout } from '../../api/auth';

@connect(state => ({
  loggedInUser: state.login.get('loggedInUser'),
}))
export default class Menu extends Component {

  static propTypes = {
    loggedInUser: PropTypes.object,
  }

  constructor() {
    super();

    this.handleLogout = this.handleLogout.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    console.log('#### ', nextProps.loggedInUser);
  }

  handleLogout() {
    firebaseLogout();
  }

  renderDashboardMenuItem() {
    const { loggedInUser } = this.props;
    if (loggedInUser && loggedInUser.role === roles.ADMIN) {
      return <Link to={ routeCodes.DASHBOARD }>Dashboard</Link>;
    }
    return '';
  }

  render() {
    return (
      <div className='Menu'>
        <IndexLink to={ routeCodes.ORDER }>
          Order
        </IndexLink>
        <Link to={ routeCodes.OVERVIEW }>
          Overview
        </Link>
        { this.renderDashboardMenuItem() }
        <span className='Menu-right'>
          { userSignedIn() && <button className='Menu-button' onClick={ this.handleLogout }>Logout</button> }
        </span>
      </div>
    );
  }
}
