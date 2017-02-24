import React, { Component, PropTypes } from 'react';
import GridFood from 'components/Client/GridFood';

export default class Grid extends Component {
  static propTypes = {
    food: PropTypes.array,
  }
  render() {
    const { food } = this.props;
    return (
      <GridFood
        food={ food }
      />
    );
  }
}
