import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { checkAdminRole } from 'utils/routing';

@connect(state => ({
  loggedInUser: state.login.get('loggedInUser'),
}))
export default CheckAdminRole => class AuthorizationDecorator extends Component {

  static propTypes = {
    loggedInUser: PropTypes.object,
  }

  componentWillMount() {
    const { loggedInUser } = this.props;
    checkAdminRole(loggedInUser && loggedInUser.role);
  }

  render() {
    return (
      <CheckAdminRole { ...this.props } />
    );
  }
};
