import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import SideDate from 'components/Client/SideDate';
import OrderFood from 'components/Client/OrderFood';
import OrderNote from 'components/Client/OrderNote';
import OrderSummary from 'components/Client/OrderSummary';
// import moment from 'moment';

@connect(state => ({
  loggedInUser: state.login.get('loggedInUser'),
}))
export default class Order extends Component {
  static propTypes = {
    loggedInUser: PropTypes.object,
  }
  // render() {
  //   const { loggedInUser } = this.props;
  //   return (
  //     <div className='Order'>
  //       <h1>Hello, { loggedInUser && loggedInUser.username }</h1>
  //     </div>
  //   );
  // }

  render() {
    return (
      <div className='Order'>
        <div className='MyOrder-wrapper'>
          <SideDate />
        </div>
      </div>
    );
    // {this.state.foodArray.map((item, index) => (
    //   <OrderFood
    //     key={ index }
    //     food={ item }
    //     text={ this.state.foodText[index] }
    //   />
    // ))}
    // <OrderNote />
    // <OrderSummary />
  }
}
