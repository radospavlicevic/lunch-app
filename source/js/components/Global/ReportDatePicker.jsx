
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import ReportDatePickerItem from 'components/Global/ReportDatePickerItem';
import { setReportDate } from 'actions/orders';
import { DATE_PATTERN, weekDays } from 'utils/globals';
import moment from 'moment';
import RaisedButton from 'material-ui/RaisedButton';

@connect()
export default class ReportDatePicker extends Component {
  static propTypes = {
    reportDate: PropTypes.string,
    dispatch: PropTypes.func,
  }

  constructor() {
    super();

    this.handleWeekSwitch = this.handleWeekSwitch.bind(this);
  }

  componentWillMount() {
    this.state = {
      daysModel: this.getWeek(),
      week: 0,
    };
  }

  getWeek(week = 0) {
    const daysModel = [];

    const startOfWeek = moment().add(week, 'weeks').startOf('isoWeek');
    daysModel.push({
      date: startOfWeek.format(DATE_PATTERN),
      day: weekDays[0],
    });

    for (let i = 1; i < 5; i++) {
      const newDate = startOfWeek.startOf('isoWeek').add(i, 'days');
      daysModel.push({
        date: newDate.format(DATE_PATTERN),
        day: weekDays[i],
      });
    }
    return daysModel;
  }

  getYear() {
    const { reportDate } = this.props;
    return moment(reportDate, DATE_PATTERN).format('YYYY');
  }

  handleWeekSwitch() {
    const { dispatch } = this.props;
    const { week } = this.state;
    const newWeek = (week === 0) ? 1 : 0;
    this.setState({
      week: newWeek,
      daysModel: this.getWeek(newWeek),
    });
    if (newWeek === 0) {
      dispatch(setReportDate(moment().format(DATE_PATTERN)));
    } else {
      dispatch(setReportDate(moment().add(1, 'weeks').startOf('isoWeek').format(DATE_PATTERN)));
    }
  }

  renderReportDatePickerItems() {
    const { daysModel } = this.state;
    const { reportDate } = this.props;
    return (
      daysModel.map((data, index) => {
        return (
          <ReportDatePickerItem
            key={ index }
            data={ data }
            selected={ data.date === reportDate }
          />
        );
      })
    );
  }

  render() {
    const { week } = this.state;
    return (
      <div className='ReportDatePicker'>
        <h1>{ this.getYear() }</h1>
        <div className='ReportDatePicker-controls'>
          { this.renderReportDatePickerItems() }
        </div>
        <div className='ReportDatePicker-weekSwitch'>
          <RaisedButton
            onClick={ this.handleWeekSwitch }
            className='ReportDatePicker-button'
            label={ week === 0 ? 'Next Week' : 'Current Week' }
          />
        </div>
      </div>
    );
  }
}
