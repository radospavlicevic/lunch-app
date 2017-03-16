import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import RaisedButton from 'material-ui/RaisedButton';
import { routeCodes } from '../../routes';
import pencilImg from '../../../assets/img/pencil.png';

export default class MealOverview extends Component {
  static propTypes = {
    data: PropTypes.object,
  }

  renderDishes() {
    const { mealItems } = this.props.data;
    return (
    mealItems.map((data, index) => {
      return (
        <div className='Overview-items' key={ index }>
          <div className='Overview-items--category'>{ data.category }:</div>
          <div className='Overview-items--dish'>{ data.dish.name }</div>
        </div>
      );
    })
    );
  }

  render() {
    const { data } = this.props;
    return (
      <div className='Overview-meal'>
        <h1 className='Overview-mealHeader'>Meal overview:</h1>
        { data.mealItems ? this.renderDishes() : null }
        { data.note &&
          <div className='Overview-note'>
            <h1 className='Overview-mealHeader'>Note: </h1>
            <div className='Overview-note--text'>{ data.note }</div>
          </div>
        }
        <Link to={ routeCodes.ORDER }><RaisedButton className='Overview-editButton' icon={ <pencilImg className='pencilImg' /> } >Edit</RaisedButton></Link>
      </div>
    );
  }
}
