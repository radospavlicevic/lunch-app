import React, { Component, PropTypes } from 'react';
import { userSignedIn } from 'api/auth';
import FoodItem from 'components/Client/FoodItem';

export default class Grid extends Component {
  static propTypes = {
    dishes: PropTypes.object,
    category: PropTypes.object,
    selectedDate: PropTypes.string,
    orders: PropTypes.object,
  }

  isSelected(dishKey) {
    const { category, selectedDate, orders } = this.props;
    if (!orders[selectedDate]) return false;
    if (!orders[selectedDate][userSignedIn().uid]) return false;
    return (orders[selectedDate][userSignedIn().uid].meal[category.key] === dishKey);
  }

  renderDishes() {
    const { dishes, selectedDate } = this.props;

    if (!dishes) {
      return <h1 className='Grid-loading'>No dishes</h1>;
    }

    return Object.keys(dishes).map((key, index) => {
      return (
        <FoodItem
          key={ index }
          dishKey={ key }
          dishData={ dishes[key] }
          selected={ this.isSelected(key) }
          selectedDate={ selectedDate }
        />
      );
    });
  }

  render() {
    return (
      <div className='Grid'>
        { this.renderDishes() }
      </div>
    );
  }
}
