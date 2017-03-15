
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
}))

export default class Menu extends Component {

  static propTypes = {
    loggedInUser: PropTypes.object,
    breakpoint: PropTypes.string,
  }

  constructor() {
    super();
    this.state = { open: false };

    this.handleLogout = this.handleLogout.bind(this);
    this.renderMenu = this.renderMenu.bind(this);
    this.toggleNavigation = this.toggleNavigation.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleLogout() {
    firebaseLogout();
  }

  handleToggle = () => this.setState({ open: !this.state.open });
  handleClose = () => this.setState({ open: false });

  toggleNavigation() {
    return (
      <div>
        <Drawer
          docked={ false }
          open={ this.state.open }
          onRequestChange={ (open) => this.setState({ open }) }
        >
          <Link className='Menu-link' to={ routeCodes.ORDER }><MenuItem onTouchTap={ this.handleClose }>Order</MenuItem></Link>
          <Link className='Menu-link' to={ routeCodes.OVERVIEW }><MenuItem onTouchTap={ this.handleClose }>Overview</MenuItem></Link>
          { userSignedIn() &&
            <span className='Menu-link'>
              <MenuItem
                onClick={ this.handleLogout }
                primaryText='Logout'
              />
            </span>
          }
          <Divider />
        </Drawer>
      </div>
    );
  }

  renderDashboardMenuItem() {
    const { loggedInUser } = this.props;
    if (loggedInUser && loggedInUser.role === roles.ADMIN) {
      return <Link to={ routeCodes.MENUS }><FlatButton className='Menu-button' label='Admin' /></Link>;
    }
    return '';
  }

  renderMenu() {
    return (
      <div>
        <IndexLink to={ routeCodes.ORDER }>
          <FlatButton
            label='Order'
            className='Menu-button'
          />
        </IndexLink>
        <Link to={ routeCodes.OVERVIEW }>
          <FlatButton
            label='Overview'
            className='Menu-button'
          />
        </Link>
        { this.renderDashboardMenuItem() }
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
        <div className='Menu-navWrapper'>
          { breakpoint === 'sm' ? this.toggleNavigation() : this.renderMenu() }
        </div>
      </AppBar>
    );
  }
}
