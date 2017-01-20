import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Register from '../../components/Admin/Register';
import UserOverview from '../../components/Admin/UserOverview';

@connect(state => ({
  loggedInUser: state.login.get('loggedInUser'),
}))
export default class Users extends Component {

  static propTypes = {
    loggedInUser: PropTypes.object,
  }

  render() {
    const { loggedInUser } = this.props;
    return (
      <div className='Users'>
        <Register loggedInUser={ loggedInUser } />
        <UserOverview />
      </div>
    );
  }
}
