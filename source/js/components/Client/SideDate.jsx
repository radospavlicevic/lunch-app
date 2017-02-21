import React, { Component } from 'react';
import SideDateItem from 'components/Client/SideDateItem';
import moment from 'moment';

export default class SideDate extends Component {
  static propTypes = {
  }

  constructor() {
    super();

    this.state = {
      counter: 0,
      dayViews: this.getCurrentWeek(0),
    };

    this.handlePreviousClick = this.handlePreviousClick.bind(this);
    this.handleNextClick = this.handleNextClick.bind(this);
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.counter !== this.state.counter) {
      this.setState({
        dayViews: this.getCurrentWeek(nextState.counter),
      });
    }
  }

  // function returns formatted date as id
  getTimestamp(date) {
    return moment(date, 'DD-MM-YYYY').format('x');
  }

  getCurrentWeek(counter) {
    const dayViews = [];
    // get current week
    const startOfWeek = moment().add(counter, 'weeks').startOf('isoWeek');
    // 3 - add current month,days and ID to daysArray (before for loop so this item goes first)
    dayViews.push(startOfWeek.format('DD-MM-YYYY'));

    // 2 - get second,third,fourth, and fifth day of the current week
    for (let i = 1; i < 5; i++) {
      const newDate = startOfWeek.startOf('isoWeek').add(i, 'days');
      // console.log('NEW_DATE', newDate.format('DD-MM-YYYY'));
      dayViews.push(newDate.format('DD-MM-YYYY'));
    }
    return dayViews;
  }

  handlePreviousClick() {
    this.setState({
      counter: this.state.counter - 1,
    });
  }

  handleNextClick() {
    this.setState({
      counter: this.state.counter + 1,
    });
  }

  renderSideDateItems() {
    const { dayViews } = this.state;
    return (
      dayViews.map((date) => {
        return (
          <SideDateItem
            key={ this.getTimestamp(date) }
            date={ date }
          />
        );
      })
    );
  }

  render() {
    return (
      <div className='SideDate-wrapper'>
        <button onClick={ this.handlePreviousClick } className='SideDate-loadButton'>Previous</button>
        { this.renderSideDateItems() }
        <button onClick={ this.handleNextClick } className='SideDate-loadButton'>Next</button>
      </div>
    );
  }
}
