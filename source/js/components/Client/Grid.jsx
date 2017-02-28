import React, { Component, PropTypes } from 'react';
import FoodItem from 'components/Client/FoodItem';

export default class Grid extends Component {
  static propTypes = {
    dishes: PropTypes.object,
    selectedDate: PropTypes.string,
  }

  renderDishes() {
    const { dishes, selectedDate } = this.props;
    if (!dishes) {
      return <h1 className='Grid-loading'>Loading...</h1>;
    }
    return Object.keys(dishes).map((key, index) => {
      return (
        <FoodItem
          key={ index }
          dishKey={ key }
          dishData={ dishes[key] }
          selected={ false }
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
