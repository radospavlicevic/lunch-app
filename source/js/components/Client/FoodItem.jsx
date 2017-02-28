
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { saveDishInOrder } from 'api/orders';

@connect()
export default class FoodItem extends Component {
  static propTypes = {
    dishKey: PropTypes.string,
    dishData: PropTypes.object,
    selectedDate: PropTypes.string,
    selected: PropTypes.bool,
    // dispatch: PropTypes.func,
  }

  constructor() {
    super();

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    const { dishKey, dishData, selectedDate } = this.props;
    saveDishInOrder(selectedDate, { key: dishKey, category: dishData.category });
  }

  render() {
    const { dishData } = this.props;
    return (
      <button className='FoodItem' onClick={ this.handleClick }>
        <p>{ dishData.name }</p>
        { dishData.description && <div className='FoodItem-desc' >{ dishData.description }</div> }
      </button>
    );
  }
}
