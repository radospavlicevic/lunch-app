import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

@connect(state => ({
  loggedInUser: state.login.get('loggedInUser'),
}))
export default class Order extends Component {
  static propTypes = {
    loggedInUser: PropTypes.object,
  }

  render() {
    const { loggedInUser } = this.props;
    return (
      <div className='Order'>
        <h1>Hello, { loggedInUser && loggedInUser.username }</h1>
      </div>
    );
  }
}
