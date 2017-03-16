import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { setReportDate } from 'actions/orders';
import { DATE_PATTERN, months } from 'utils/globals';
import moment from 'moment';

@connect()
export default class ReportDatePickerItem extends Component {
  static propTypes = {
    data: PropTypes.object,
    selected: PropTypes.bool,
    dispatch: PropTypes.func,
  }

  constructor() {
    super();

    this.handleClick = this.handleClick.bind(this);
  }

  getDay() {
    const { data } = this.props;
    return moment(data.date, 'DD-MM-YYYY').format('DD');
  }

  getMonth() {
    const { data } = this.props;
    return moment(data.date, DATE_PATTERN).format('M');
  }

  getMonthName() {
    return months[this.getMonth() - 1];
  }

  handleClick(event) {
    event.preventDefault();
    const { data, dispatch } = this.props;
    dispatch(setReportDate(data.date));
  }

  render() {
    const { selected, data } = this.props;
    return (
      <button
        onClick={ this.handleClick }
        className={ selected ? 'ReportDatePicker-item ReportDatePicker-item--active' : 'ReportDatePicker-item' }
      >
        <p>{ data.day }</p>
        <p>{ this.getDay() }. { this.getMonthName() }</p>
      </button>
    );
  }
}
