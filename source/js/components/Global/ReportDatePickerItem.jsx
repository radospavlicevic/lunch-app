import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { setReportDate } from 'actions/orders';
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
    return moment(data.date, 'DD-MM-YYYY').format('D');
  }

  getMonthName() {
    const { data } = this.props;
    return moment(data.date, 'DD-MM-YYYY').format('MMMM');
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
        className={ selected ? 'ReportDatePicker-item--active' : 'ReportDatePicker-item' }
      >
        <p>{ data.day }</p>
        <span>{ this.getMonthName() }<br />{ this.getDay() }</span>
      </button>
    );
  }
}
