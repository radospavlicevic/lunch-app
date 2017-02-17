import React, { Component, PropTypes } from 'react';
import SideDateItem from 'components/Client/SideDateItem';
import moment from 'moment';

export default class SideDate extends Component {
  static propTypes = {
  }

  constructor() {
    super();

    const startDay = moment().startOf('isoWeek');

    this.state = {
      counter: 0,
      dayViews: this.initDaysInCurrentWeek(),
      selectedId: this.getMonthId(startDay),
    };
  }

  // function returns formatted date as number
  getNumberOfDate(date) {
    return date.format('D');
  }
  // function returns formatted date as month name
  getMonthOfDate(date) {
    return date.format('MMMM');
  }
  // function returns formatted date as id
  getMonthId(date) {
    return date.format('x');
  }

  getDay(monthName, monthNumber, monthId) {
    const day = {
      month: monthName,
      number: monthNumber,
      id: monthId,
    };
    return day;
  }

  initDaysInCurrentWeek() {
    const dayViews = [];
    const date = moment();
    // get current week
    const startOfWeek = date.startOf('isoWeek');
    // get name of the current month
    const nameOfMonth = this.getMonthOfDate(startOfWeek);
    // get number of day in current month
    const numberOfCurrentDay = this.getNumberOfDate(startOfWeek);
    // get number of day in current month as ID
    const monthDayId = this.getMonthId(startOfWeek);
    // 3 - add current month,days and ID to daysArray (before for loop so this item goes first)
    dayViews.push(this.getDay(nameOfMonth, numberOfCurrentDay, monthDayId));
    // 2 - get second,third,fourth, and fifth day of the current week
    for (let i = 1; i < 5; i++) {
      const newDate = date.startOf('isoWeek').add(i, 'days');
      const numberOfNextDaysOfWeek = this.getNumberOfDate(newDate);
      const nameOfMonthOfDaysInSpecWeek = this.getMonthOfDate(newDate);
      const dayId = this.getMonthId(newDate);
      dayViews.push(this.getDay(nameOfMonthOfDaysInSpecWeek, numberOfNextDaysOfWeek, dayId));
    }
    return dayViews;
  }

  changeWeekDays(isNext) {
    const {
      counter,
    } = this.state;
    let newCounter = 0;
    if (isNext) {
      newCounter = counter + 1;
    } else {
      newCounter = counter - 1;
    }
    const newDaysArray = [];
    const newWeek = moment().add(newCounter, 'weeks').startOf('isoWeek');
    const newWeekNumber = this.getNumberOfDate(newWeek);
    const newWeekMonth = this.getMonthOfDate(newWeek);
    const newWeekId = this.getMonthId(newWeek);
    newDaysArray.push(this.getDay(newWeekMonth, newWeekNumber, newWeekId));
    for (let i = 1; i < 5; i++) {
      const newWeekDate = newWeek.clone().add(i, 'days');
      const numberOfDays = this.getNumberOfDate(newWeekDate);
      const nameOfMonth = this.getMonthOfDate(newWeekDate);
      const dayId = this.getMonthId(newWeekDate);
      newDaysArray.push(this.getDay(nameOfMonth, numberOfDays, dayId));
    }
  }

  renderSideDateItems() {
    const { dayViews } = this.state;
    return (
      dayViews.map((item, index) => {
        return (
          <SideDateItem
            key={ index }
            id={ item.id }
            date={ { day: item.number, month: item.month } }
            isActive={ false }
          />
        );
      })
    );
  }

  render() {
    return (
      <div className='SideDate-wrapper'>
        <button onClick={ () => { this.changeWeekDays(false); } } className='SideDate-loadButton'>Previous</button>
        { this.renderSideDateItems() }
        <button onClick={ () => { this.changeWeekDays(true); } } className='SideDate-loadButton'>Next</button>
      </div>
    );
  }
}
