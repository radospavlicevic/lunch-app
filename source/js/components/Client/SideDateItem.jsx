import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { userSignedIn } from 'api/auth';
import { DATE_PATTERN, isPastDate } from 'utils/globals';
import moment from 'moment';

@connect()
export default class SideDateItem extends Component {
  static propTypes = {
    date: PropTypes.string,
    selected: PropTypes.bool,
    orders: PropTypes.object,
    day: PropTypes.string,
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

  getOrderState() {
    const { orders, date } = this.props;
    if (isPastDate(date)) {
      return 'overview';
    }
    if (orders[date]
      && orders[date][userSignedIn().uid]
      && orders[date][userSignedIn().uid].meal) {
      return 'overview';
    }
    return '';
  }

  handleClick() {
    window.scrollTo(0, 0);
  }

  render() {
    const { date, selected, day } = this.props;
    return (
      <Link
        onClick={ this.handleClick }
        to={ `/order/${ date }/${ this.getOrderState() }` }
        className={ selected ? 'SideDate SideDate--active' : 'SideDate' }
      >
        <p className='SideDate-month'>{ this.getMonthName() }</p>
        <p className='SideDate-day'>{ this.getDay() }</p>
        <span className='SideDate-dayName'>{ day }</span>
      </Link>
    );
  }
}
