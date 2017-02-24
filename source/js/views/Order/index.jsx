import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import SideDate from 'components/Client/SideDate';
import OrderFood from 'components/Client/OrderFood';
import OrderNote from 'components/Client/OrderNote';
import OrderSummary from 'components/Client/OrderSummary';
// import moment from 'moment';

@connect(state => ({
  loggedInUser: state.login.get('loggedInUser'),
  menus: state.menus.get('menus'),
}))
export default class Order extends Component {
  static propTypes = {
    loggedInUser: PropTypes.object,
    menus: PropTypes.object,
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
    const { menus } = this.props;
    console.log('MENUS', menus);
    return (
      <div className='Order'>
        <SideDate />
        <div className='MyOrder-wrapper'></div>
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
