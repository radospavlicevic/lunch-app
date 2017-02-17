import React, { Component, PropTypes } from 'react';

export default class SideDateItem extends Component {
  static propTypes = {
    id: PropTypes.string,
    date: PropTypes.object,
    isActive: PropTypes.bool,
  }

  constructor() {
    super();

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    event.preventDefault();
    console.log('CLICKED');
  }


  render() {
    const {
      id,
      date,
      isActive,
    } = this.props;
    return (
      <button
        onClick={ this.handleClick }
        className={ isActive ? 'SideDate-active' : 'SideDate' }
      >
        <p className='SideDate-month'>{ date.month }</p>
        <p className='SideDate-day'>{ date.day }</p>
        <p className='SideDate-viewOrders'>view orders</p>
      </button>
    );
  }
}
