import React, { Component, PropTypes } from 'react';

export default class FoodText extends Component {
  static propTypes = {
    text: PropTypes.string,
  }
  render() {
    const { text } = this.props;
    return (
      <p className='FoodText-text'>{ text }</p>
    );
  }
}
