
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

@connect()
export default class FoodItem extends Component {
  static propTypes = {
    dishKey: PropTypes.string,
    dishData: PropTypes.object,
    selected: PropTypes.bool,
    // dispatch: PropTypes.func,
  }

  render() {
    const { dishData, selected } = this.props;
    return (
      <button className='FoodItem'>
        <p>{ dishData.name }</p>
        { dishData.description && <div className='FoodItem-desc' >{ dishData.description }</div> }
      </button>
    );
  }
}
