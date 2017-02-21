import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { setSelectedDate } from 'actions/order';
import moment from 'moment';

@connect(state => ({
  selectedDate: state.order.get('selectedDate'),
}))
export default class SideDateItem extends Component {
  static propTypes = {
    date: PropTypes.string,
    selectedDate: PropTypes.string,
    dispatch: PropTypes.func,
  }

  constructor() {
    super();

    this.handleClick = this.handleClick.bind(this);
  }

  componentWillMount() {
    const { date, selectedDate } = this.props;
    this.state = {
      active: date === selectedDate,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { date, selectedDate } = this.props;
    if (nextProps.selectedDate !== selectedDate) {
      this.setState({
        active: nextProps.selectedDate === date,
      });
    }
  }

  // function returns formatted date as number
  getDay() {
    const { date } = this.props;
    return moment(date, 'DD-MM-YYYY').format('D');
  }
  // function returns formatted date as month name
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
    const { active } = this.state;
    return (
      <button
        onClick={ this.handleClick }
        className={ active ? 'SideDate-active' : 'SideDate' }
      >
        <p className='SideDate-month'>{ this.getMonthName() }</p>
        <p className='SideDate-day'>{ this.getDay() }</p>
        <p className='SideDate-viewOrders'>view orders</p>
      </button>
    );
  }
}
