
import React, { Component, PropTypes } from 'react';
import { removeDish } from 'api/meals';
import { prepareDishUpdate } from 'actions/meals';
import { connect } from 'react-redux';

@connect()
export default class EditableDishItem extends Component {
  static propTypes = {
    dishKey: PropTypes.string,
    dishData: PropTypes.object,
    dispatch: PropTypes.func,
  }

  constructor() {
    super();

    this.handleDeleteClick = this.handleDeleteClick.bind(this);
    this.handleEditClick = this.handleEditClick.bind(this);
  }

  handleDeleteClick() {
    const { dishKey } = this.props;
    removeDish(dishKey);
  }

  handleEditClick() {
    const { dishKey, dishData, dispatch } = this.props;
    dispatch(prepareDishUpdate(dishKey, dishData));
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
          <button className='DishItem-button' onClick={ this.handleEditClick }>Edit</button>
        </div>
      </div>
    );
  }
}
