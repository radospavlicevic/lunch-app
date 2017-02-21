import React, { Component } from 'react';

export default class OrderNote extends Component {
  render() {
    return (
      <div className='OrderNote'>
        <p className='FoodText-text'>Any side notes?</p>
        <div className='OrderNote-input'>
          <input
            type='text'
            placeholder='Any note?'
          >Any note?
          </input>
        </div>
      </div>
    );
  }

}
