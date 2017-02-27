import React, { Component, PropTypes } from 'react';

import FoodText from 'components/Client/FoodText';
import Grid from 'components/Client/Grid';

export default class OrderFood extends Component {
  static propTypes = {
    dishes: PropTypes.object,
    text: PropTypes.string,
  }
  render() {
    const { food, text } = this.props;
    return (
      <div className='MyOrder'>
        // <FoodText text={ text } />
        // <Grid food={ food } />
      </div>
    );
  }

}
