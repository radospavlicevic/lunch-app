import React, { Component } from 'react';

export default class OrderSummary extends Component {
  render() {
    return (
      <div className='OrderSummary'>
        <p className='FoodText-text'>
          Here is your overview for 20th of September
        </p>
        <div className='OrderSummary-summary'>
          <p className='OrderSummary-text'>
            Item1 :
          </p>
          <p className='OrderSummary-text'>
            Item2 :
          </p>
          <p className='OrderSummary-text'>
            Item3 :
          </p>
          <p className='OrderSummary-text'>
            Item4 :
          </p>
          <div className='OrderSummary-edit'>
            <button>Edit</button>
          </div>
        </div>
      </div>
    );
  }
}
