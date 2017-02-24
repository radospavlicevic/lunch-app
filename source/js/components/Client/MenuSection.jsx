import React, { Component, PropTypes } from 'react';

import FoodText from 'components/Client/FoodText';
import Grid from 'components/Client/Grid';

export default class MenuSection extends Component {
  static propTypes = {
    text: PropTypes.string,
    dishes: PropTypes.object,
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
