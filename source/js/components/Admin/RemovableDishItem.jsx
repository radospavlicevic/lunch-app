
import React, { Component, PropTypes } from 'react';
import { deleteDishFromMenu } from 'api/menus';
import { connect } from 'react-redux';

@connect()
export default class RemovableDishItem extends Component {
  static propTypes = {
    dishKey: PropTypes.string,
    dishData: PropTypes.object,
    lunchDay: PropTypes.string,
    // dispatch: PropTypes.func,
  }

  constructor() {
    super();

    this.handleDeleteClick = this.handleDeleteClick.bind(this);
  }

  handleDeleteClick() {
    const { dishKey, lunchDay } = this.props;
    deleteDishFromMenu(lunchDay, dishKey);
  }

  render() {
    const { dishData } = this.props;
    return (
      <div className='DishItem'>
        <h2>{ dishData.name }</h2>
        { dishData.description && <div className='DishItem-desc' >{ dishData.description }</div> }
        <hr />
        <div className='DishItem-footer'>
          <div className='DishItem-price'>{ dishData.price ? dishData.price : 0 }din</div>
          <button className='DishItem-button' onClick={ this.handleDeleteClick }>Delete</button>
        </div>
      </div>
    );
  }
}
