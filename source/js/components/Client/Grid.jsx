import React, { Component, PropTypes } from 'react';
import { userSignedIn } from 'api/auth';
import FoodItem from 'components/Client/FoodItem';
import { deleteDishFromOrder } from 'api/orders';

export default class Grid extends Component {
  static propTypes = {
    dishes: PropTypes.object,
    category: PropTypes.object,
    selectedDate: PropTypes.string,
    orders: PropTypes.object,
  }
  constructor() {
    super();

    this.handleCancelClick = this.handleCancelClick.bind(this);
  }

  handleCancelClick() {
    const { selectedDate, category } = this.props;
    deleteDishFromOrder(selectedDate, category.key);
  }

  isSelected(dishKey) {
    const { category, selectedDate, orders } = this.props;
    if (!orders[selectedDate]) return false;
    if (!orders[selectedDate][userSignedIn().uid]) return false;
    if (!orders[selectedDate][userSignedIn().uid].meal) return false;
    return (orders[selectedDate][userSignedIn().uid].meal[category.key] === dishKey);
  }

  renderDishes() {
    const { dishes, selectedDate } = this.props;

    return Object.keys(dishes).map((key, index) => {
      return (
        <div className='Col Col--md-4 Col--lg-3' key={ index }>
          <FoodItem
            dishKey={ key }
            dishData={ dishes[key] }
            selected={ this.isSelected(key) }
            selectedDate={ selectedDate }
          />
        </div>
      );
    });
  }

  render() {
    return (
      <div className='Grid'>
        { this.renderDishes() }
        <div className='Col Col--md-4 Col--lg-3'>
          <button
            onClick={ this.handleCancelClick }
            className='FoodItem'
          >
            <p>None</p>
          </button>
        </div>
      </div>
    );
  }
}
