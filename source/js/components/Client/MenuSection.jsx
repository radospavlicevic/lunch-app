import React, { Component, PropTypes } from 'react';

import Grid from 'components/Client/Grid';

export default class MenuSection extends Component {
  static propTypes = {
    dishes: PropTypes.object,
    category: PropTypes.string,
  }

  render() {
    const { dishes, category } = this.props;
    return (
      <div className='MenuSection'>
        <p className='MenuSection-category'>{ category }</p>
        <Grid dishes={ dishes } />
      </div>
    );
  }

}
