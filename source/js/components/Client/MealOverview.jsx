import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { isPastDate } from 'utils/globals';
import RaisedButton from 'material-ui/RaisedButton';

export default class MealOverview extends Component {
  static propTypes = {
    date: PropTypes.string,
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
    const { date, data } = this.props;
    return (
      <div className='Overview-top'>
        <div className='Overview-meal'>
          <h1 className='Overview-mealHeader'>Meal overview:</h1>
          { !data && <h2>No order for this day.</h2>}
          { data && data.mealItems ? this.renderDishes() : null }
          { data && data.note &&
            <div className='Overview-note'>
              <h1 className='Overview-mealHeader Overview-mealHeader--note'>Note: </h1>
              <div className='Overview-note--text'>{ data.note }</div>
            </div>
          }
          { !isPastDate(date) && <Link to={ `/order/${ date }/edit` }><RaisedButton className='Overview-editButton' label='Edit' /></Link> }
        </div>
      </div>
    );
  }
}
