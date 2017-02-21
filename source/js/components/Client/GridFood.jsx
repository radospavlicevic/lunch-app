import React, { Component, PropTypes } from 'react';

export default class GridFood extends Component {
  static propTypes = {
    food: PropTypes.array,
  }
  render() {
    const {
      food,
    } = this.props;
    return (
      <div className='Grid-foodWrapper'>
        {food.map((item, index) => (
          <p
            id={ index + 1 }
            key={ index }
          >{ item.name }
          </p>
        ))}
      </div>
    );
  }
}
