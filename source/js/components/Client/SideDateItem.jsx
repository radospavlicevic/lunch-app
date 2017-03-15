import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { DATE_PATTERN } from 'utils/globals';
import { setSelectedDate } from 'actions/orders';
import moment from 'moment';

@connect()
export default class SideDateItem extends Component {
  static propTypes = {
    date: PropTypes.string,
    selected: PropTypes.bool,
    dispatch: PropTypes.func,
  }

  constructor() {
    super();

    this.handleClick = this.handleClick.bind(this);
  }

  // function returns formatted date as number
  getDay() {
    const { date } = this.props;
    return moment(date, DATE_PATTERN).format('D');
  }
  // function returns formatted date as month name
  getMonthName() {
    const { date } = this.props;
    return moment(date, DATE_PATTERN).format('MMM');
  }

  handleClick(event) {
    event.preventDefault();
    const { date, dispatch } = this.props;
    dispatch(setSelectedDate(date));
  }

  render() {
    const { selected } = this.props;
    return (
      <button
        onClick={ this.handleClick }
        className={ selected ? 'SideDate-active' : 'SideDate' }
      >
        <p className='SideDate-month'>{ this.getMonthName() }</p>
        <p className='SideDate-day'>{ this.getDay() }</p>
      </button>
    );
  }
}
