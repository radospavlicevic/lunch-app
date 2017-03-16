import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { setSelectedDate } from 'actions/orders';
import moment from 'moment';

@connect()
export default class WeekPickerItem extends Component {
  static propTypes = {
    date: PropTypes.string,
    selected: PropTypes.bool,
    dispatch: PropTypes.func,
  }

  constructor() {
    super();

    this.handleClick = this.handleClick.bind(this);
  }

  getDay() {
    const { date } = this.props;
    return moment(date, 'DD-MM-YYYY').format('D');
  }

  getMonthName() {
    const { date } = this.props;
    return moment(date, 'DD-MM-YYYY').format('MMMM');
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
        className={ selected ? 'WeekPicker-item WeekPicker-item--active' : 'WeekPicker-item' }
      >
        <span>{ this.getMonthName() }<br />{ this.getDay() }</span>
      </button>
    );
  }
}
