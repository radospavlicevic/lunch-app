import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { routeCodes } from '../../routes';

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
          <p className='Overview-itemName'>{ data.category }: { data.dish.name }</p>
          { data.category === 'Glavna jela' &&
            <p className='Overview-itemDesc'>{ data.dish.description }</p>
          }
        </div>
      );
    })
    );
  }

  render() {
    const { data } = this.props;
    return (
      <div className='Overview-wrap'>
        <h1 className='Overview-headerText'>meal overview :</h1>
        { this.renderDishes() }
        { data.note &&
        <p className='Overview-note'>Note: { data.note }</p>
        }
        <Link className='Overview-edit' to={ routeCodes.ORDER }>
          Edit
        </Link>
      </div>
    );
  }
}
