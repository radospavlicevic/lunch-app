import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { db } from 'utils/firebase_config';
import { addCategory } from 'actions/meals.js';
import { addDishInMenu } from 'actions/menus';
import SideDate from 'components/Client/SideDate';
import MenuSection from 'components/Client/MenuSection';
import OrderFood from 'components/Client/OrderFood';
import OrderNote from 'components/Client/OrderNote';
import OrderSummary from 'components/Client/OrderSummary';
// import moment from 'moment';

@connect(state => ({
  loggedInUser: state.login.get('loggedInUser'),
  menus: state.menus.get('menus'),
  selectedDate: state.order.get('selectedDate'),
}))
export default class Order extends Component {
  static propTypes = {
    loggedInUser: PropTypes.object,
    menus: PropTypes.object,
    selectedDate: PropTypes.string,
    dispatch: PropTypes.func,
  }

  componentWillMount() {
    const { loggedInUser } = this.props;

    this.foodText = [
      `Hello ${ loggedInUser && loggedInUser.username }, Please choose soup you'd like to eat:`,
      'Awesome, and the main dish?',
      'What about salad?',
      'Did you save room for dessert?'];
    this.setupFirebaseObservers();
  }

  setupFirebaseObservers() {
    const { selectedDate, dispatch } = this.props;

    db.ref('categories').on('child_added', newCategory => {
      dispatch(addCategory(newCategory.key, newCategory.val().name));
    });

    db.ref('menus').on('child_added', newMenuDish => {
      dispatch(
        addDishInMenu(selectedDate, newMenuDish.key, newMenuDish.val())
      );
    });
  }

  // renderMenuSections() {
  //   const { menus, selectedDate } = this.props;
  //   Object.keys(menus[selectedDate]).map((key) => {
  //     return <MenuSection />;
  //   });
  // }

  render() {
    const { menus } = this.props;
    return (
      <div className='Order'>
        <SideDate />
        <div className='MyOrder-wrapper'>
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
