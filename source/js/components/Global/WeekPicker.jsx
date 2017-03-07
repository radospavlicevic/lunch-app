
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import WeekPickerItem from 'components/Global/WeekPickerItem';
import { setSelectedDate } from 'actions/orders';
import { DATE_PATTERN } from 'utils/globals';
import moment from 'moment';

@connect()
export default class WeekPicker extends Component {
  static propTypes = {
    selectedDate: PropTypes.string,
    dispatch: PropTypes.func,
  }

  constructor() {
    super();

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

  getYear() {
    const { selectedDate } = this.props;
    return moment(selectedDate, DATE_PATTERN).format('YYYY');
  }

  switchWeek(indicator) {
    const { selectedDate, dispatch } = this.props;
    const newSelectedDate = moment(selectedDate, DATE_PATTERN).add(indicator * 7, 'days').format(DATE_PATTERN);
    dispatch(setSelectedDate(newSelectedDate));
  }

  handlePreviousClick() {
    this.switchWeek(-1);
  }

  handleNextClick() {
    this.switchWeek(1);
  }

  renderWeekPickerItems() {
    const { daysModel } = this.state;
    const { selectedDate } = this.props;
    return (
      daysModel.map((date, index) => {
        return (
          <WeekPickerItem
            key={ index }
            date={ date }
            selected={ date === selectedDate }
          />
        );
      })
    );
  }

  render() {
    return (
      <div className='WeekPicker'>
        <h1>{ this.getYear() }</h1>
        <div className='WeekPicker-controls'>
          <button onClick={ this.handlePreviousClick } className='WeekPicker-button'>Previous</button>
          { this.renderWeekPickerItems() }
          <button onClick={ this.handleNextClick } className='WeekPicker-button'>Next</button>
        </div>
      </div>
    );
  }
}
