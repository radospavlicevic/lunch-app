import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import SideDateItem from 'components/Client/SideDateItem';
import { DATE_PATTERN } from 'utils/globals';
import { redirectTo } from 'utils/routing';
import Swipe from 'react-easy-swipe';
import moment from 'moment';
import ComposedComponent from 'decorators/AppBreakpointsDecorator';
import back from '../../../assets/img/back.png';
import next from '../../../assets/img/next.png';

@ComposedComponent
@connect(state => ({
  breakpoint: state.app.get('breakpoint'),
}))
export default class SideDate extends Component {
  static propTypes = {
    selectedDate: PropTypes.string,
    breakpoint: PropTypes.string,
    orders: PropTypes.object,
  }

  constructor() {
    super();

    this.weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    this.weekDaysShort = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    this.handlePreviousClick = this.handlePreviousClick.bind(this);
    this.handleNextClick = this.handleNextClick.bind(this);
  }

  componentWillMount() {
    this.state = {
      daysModel: this.getWeek(),
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedDate !== this.props.selectedDate) {
      this.setState({
        daysModel: this.getWeek(nextProps.selectedDate),
      });
    }
  }

  getWeek(selectedDate = null) {
    const date = selectedDate || this.props.selectedDate;
    const daysModel = [];

    const startOfWeek = moment(date, DATE_PATTERN).startOf('isoWeek');
    // 3 - add current month,days and ID to daysArray (before for loop so this item goes first)
    daysModel.push(startOfWeek.format(DATE_PATTERN));

    // 2 - get second,third,fourth, and fifth day of the current week
    for (let i = 1; i < 5; i++) {
      const newDate = startOfWeek.startOf('isoWeek').add(i, 'days');
      daysModel.push(newDate.format(DATE_PATTERN));
    }
    return daysModel;
  }

  switchWeek(indicator) {
    const { selectedDate } = this.props;
    const newSelectedDate = moment(selectedDate, DATE_PATTERN).add(indicator * 7, 'days').startOf('isoweek').format(DATE_PATTERN);
    redirectTo(`/order/${ newSelectedDate }`);
  }

  handlePreviousClick() {
    this.switchWeek(-1);
  }

  handleNextClick() {
    this.switchWeek(1);
  }

  renderSideDateItems() {
    const { daysModel } = this.state;
    const { selectedDate, orders, breakpoint } = this.props;
    return (
      daysModel.map((date, index) => {
        return (
          <SideDateItem
            key={ index }
            date={ date }
            orders={ orders }
            selected={ date === selectedDate }
            day={ breakpoint === 'sm' ? this.weekDaysShort[index] : this.weekDays[index] }
          />
        );
      })
    );
  }

  render() {
    return (
      <Swipe
        className='SideDate-swipe'
        onSwipeRight={ this.handlePreviousClick }
        onSwipeLeft={ this.handleNextClick }
      >
        <div className='SideDate-wrapper'>
          <button onClick={ this.handlePreviousClick } className='SideDate-loadButton'>
            <img src={ back } alt='previous' />
          </button>
          { this.renderSideDateItems() }
          <button onClick={ this.handleNextClick } className='SideDate-loadButton'>
            <img src={ next } alt='next' />
          </button>
        </div>
      </Swipe>
    );
  }
}
