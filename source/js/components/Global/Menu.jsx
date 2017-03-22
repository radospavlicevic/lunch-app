
import React, { Component, PropTypes } from 'react';
import { IndexLink, Link } from 'react-router';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import Divider from 'material-ui/Divider';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import { connect } from 'react-redux';
import { roles } from 'utils/globals';
import ComposedComponent from 'decorators/AppBreakpointsDecorator';
import { routeCodes } from '../../routes';
import { userSignedIn, firebaseLogout } from '../../api/auth';

@ComposedComponent
@connect(state => ({
  loggedInUser: state.login.get('loggedInUser'),
  breakpoint: state.app.get('breakpoint'),
  selectedDate: state.orders.get('selectedDate'),
}))
export default class Menu extends Component {

  static propTypes = {
    loggedInUser: PropTypes.object,
    breakpoint: PropTypes.string,
    selectedDate: PropTypes.string,
  }

  constructor() {
    super();
    this.state = { open: false };

    this.handleLogout = this.handleLogout.bind(this);
    this.renderMenu = this.renderMenu.bind(this);
    this.toggleNavigation = this.toggleNavigation.bind(this);
  }

  handleLogout() {
    firebaseLogout();
  }

  handleToggle = () => this.setState({ open: !this.state.open });
  handleClose = () => this.setState({ open: false });

  toggleNavigation() {
    const { selectedDate } = this.props;
    return (
      <div>
        <Drawer
          docked={ false }
          open={ this.state.open }
          onRequestChange={ (open) => this.setState({ open }) }
        >
          <Link className='Menu-link' to={ `/order/${ selectedDate }` }><MenuItem onTouchTap={ this.handleClose }>Home</MenuItem></Link>
          {/* <Link className='Menu-link'
          to={ routeCodes.OVERVIEW }><MenuItem onTouchTap={ this.handleClose }>
          Overview</MenuItem></Link> */}
          <Divider />
          { this.renderAdminNavigationMenu() }
          { userSignedIn() &&
            <MenuItem
              onClick={ this.handleLogout }
              primaryText='Logout'
            />
          }
        </Drawer>
      </div>
    );
  }

  renderAdminNavigationMenu() {
    const { loggedInUser } = this.props;
    if (loggedInUser && loggedInUser.role === roles.ADMIN) {
      return (
        <div>
          <Link className='Menu-link' to={ routeCodes.MENUS } onTouchTap={ this.handleClose }><MenuItem>Menus</MenuItem></Link>
          <Link className='Menu-link' to={ routeCodes.DISHES } onTouchTap={ this.handleClose }><MenuItem>Dishes</MenuItem></Link>
          <Link className='Menu-link' to={ routeCodes.CATEGORIES } onTouchTap={ this.handleClose }><MenuItem>Categories</MenuItem></Link>
          <Link className='Menu-link' to={ routeCodes.CATERINGS } onTouchTap={ this.handleClose }><MenuItem>Caterings</MenuItem></Link>
          <Link className='Menu-link' to={ routeCodes.USERS } onTouchTap={ this.handleClose }><MenuItem>Users</MenuItem></Link>
          <Link className='Menu-link' to={ routeCodes.WEEKLY_OVERVIEW } onTouchTap={ this.handleClose }><MenuItem>Weekly Overview</MenuItem></Link>
          <Link className='Menu-link' to={ routeCodes.REPORT } onTouchTap={ this.handleClose }><MenuItem>Report</MenuItem></Link>
          <Divider />
        </div>
      );
    }
    return '';
  }

  renderAdminMenuItem() {
    const { loggedInUser } = this.props;
    if (loggedInUser && loggedInUser.role === roles.ADMIN) {
      return <IndexLink className='Menu-button' activeClassName='Menu-button--active' to={ routeCodes.MENUS }><FlatButton label='Admin' /></IndexLink>;
    }
    return '';
  }

  renderMenu() {
    const { selectedDate } = this.props;
    return (
      <div>
        <IndexLink
          className='Menu-button'
          activeClassName='Menu-button--active'
          to={ `/order/${ selectedDate }` }
        >
          <FlatButton label='Home' />
        </IndexLink>
        {/* <IndexLink className='Menu-button'
          activeClassName='Menu-button--active' to={ routeCodes.OVERVIEW }>
          <FlatButton label='Overview' />
        </IndexLink> */}
        { this.renderAdminMenuItem() }
        { userSignedIn() &&
          <RaisedButton
            onClick={ this.handleLogout }
            label='Logout'
          />
        }
      </div>
    );
  }

  render() {
    const { breakpoint } = this.props;
    return (
      <AppBar
        className='Menu'
        style={ { position: 'fixed' } }
        showMenuIconButton={ breakpoint === 'sm' }
        title='Yummy Yumzor'
        onLeftIconButtonTouchTap={ this.handleToggle }
      >
        { breakpoint === 'sm' ? this.toggleNavigation() : this.renderMenu() }
      </AppBar>
    );
  }
}
