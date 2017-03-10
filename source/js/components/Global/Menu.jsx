
import React, { Component, PropTypes } from 'react';
import { IndexLink, Link } from 'react-router';
import AppBar from 'material-ui/AppBar';
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

    this.handleLogout = this.handleLogout.bind(this);
  }

  handleLogout() {
    firebaseLogout();
  }

  renderDashboardMenuItem() {
    const { loggedInUser } = this.props;
    if (loggedInUser && loggedInUser.role === roles.ADMIN) {
      return <Link to={ routeCodes.DASHBOARD }><FlatButton label='Dashboard' /></Link>;
    }
    return '';
  }

  render() {
    const { breakpoint } = this.props;
    return (
      <AppBar
        className='Menu'
        showMenuIconButton={ breakpoint === 'sm' }
        title='Yummy Yumzor'
      >
        <div className='Menu-navWrapper'>
          <IndexLink to={ routeCodes.ORDER }>
            <FlatButton label='Order' />
          </IndexLink>
          <Link to={ routeCodes.OVERVIEW }>
            <FlatButton label='Overview' />
          </Link>
          { this.renderDashboardMenuItem() }
          { userSignedIn() &&
            <RaisedButton
              onClick={ this.handleLogout }
              label='Logout'
            />
          }
        </div>
      </AppBar>
    );
  }
}
