
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

@connect()
export default class DishItem extends Component {
  static propTypes = {
    dishKey: PropTypes.string,
    dishData: PropTypes.object,
    // dispatch: PropTypes.func,
  }

  render() {
    const { dishData } = this.props;
    return (
      <div className='DishItem'>
        <h2>{ dishData.name }</h2>
        { dishData.description && <div className='DishItem-desc' >{ dishData.description }</div> }
        <hr />
        <div className='DishItem-footer'>
          <div className='DishItem-price'>{ dishData.price }din</div>
        </div>
      </div>
    );
  }
}
