import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { DATE_PATTERN, formatDateSr, weekDays } from 'utils/globals';
import { tablesToExcel } from 'utils/excel_export';
import AdminMenu from 'components/Admin/AdminMenu';
import RaisedButton from 'material-ui/RaisedButton';
import { loadUsers } from 'actions/users';
import { loadCategories } from 'actions/meals';
import { addOrUpdateMenu } from 'actions/menus';
import { loadOrders } from 'actions/orders';
import moment from 'moment';
import { observableModule } from 'components/Observable/observableModule';
import CheckAdminRole from '../../decorators/AuthorizationDecorator';
import back from '../../../assets/img/back.png';
import next from '../../../assets/img/next.png';

@CheckAdminRole
@connect(state => ({
  loggedInUser: state.login.get('loggedInUser'),
  menus: state.menus.get('menus'),
  categories: state.meals.get('categories'),
  standardDishes: state.meals.get('standardDishes'),
  orders: state.orders.get('orders'),
  users: state.users.get('users'),
}))
export default class Export extends Component {
  static propTypes = {
    loggedInUser: PropTypes.object,
    menus: PropTypes.object,
    standardDishes: PropTypes.object,
    categories: PropTypes.object,
    orders: PropTypes.object,
    users: PropTypes.object,
  }

  constructor() {
    super();

    this.handleExportToExcelClick = this.handleExportToExcelClick.bind(this);
    this.tableIDs = ['mon', 'tue', 'wed', 'thu', 'fri'];
    this.state = {
      weekOffset: 0,
      weekDates: this.getChoosenWeek(),
      tablesData: [],
    };
  }

  componentWillMount() {
    this.setupFirebaseObservers();
    document.title = 'Export - Yummy Yumzor';
  }

  componentWillUpdate(nextProps, nextState) {
    const { loggedInUser, orders, menus } = this.props;
    const { weekDates } = this.state;
    if (nextProps.orders !== orders || nextProps.menus !== menus) {
      this.setState({
        tablesData: this.getTablesData(nextProps.orders),
      });
    }

    if (!loggedInUser && nextProps.loggedInUser) {
      this.setObserversForChoosenWeek();
    }

    if (nextState.weekDates !== weekDates) {
      this.setObserversForChoosenWeek(nextState.weekDates);
    }
  }

  setupFirebaseObservers() {
    const { loggedInUser } = this.props;

    observableModule.addValueObserver('users', loadUsers);
    observableModule.addValueObserver('categories', loadCategories);

    if (loggedInUser) {
      this.setObserversForChoosenWeek();
    }
  }

  setObserversForChoosenWeek(week = null) {
    const weekDates = week || this.state.weekDates;
    for (let i = 0; i < weekDates.length; i++) {
      this.setObserversFor(weekDates[i]);
    }
  }

  getChoosenWeek(offset = 0) {
    const weekDates = [];
    const startWeekDay = moment().add(offset, 'weeks').startOf('isoWeek');
    weekDates.push(startWeekDay.format(DATE_PATTERN));
    for (let i = 1; i < 5; i++) {
      weekDates.push(startWeekDay.add(1, 'day').format(DATE_PATTERN));
    }
    return weekDates;
  }

  setObserversFor(day) {
    observableModule.addValueObserver(`menus/${ day }`, addOrUpdateMenu, 2);
    observableModule.addValueObserver(`orders/${ day }`, loadOrders, 2);
  }

  getTablesData(nextOrders, weekDates = null) {
    const data = [];
    const week = weekDates || this.state.weekDates;
    for (let i = 0; i < week.length; i++) {
      data.push(this.tableOrders(nextOrders, week[i]));
    }
    return data;
  }

  getUserOrderedDishes(uid, date, orders) {
    const { menus, standardDishes } = this.props;
    if (!orders[date]) return null; // no orders for that date
    if (!orders[date][uid]) return null; // no orders for user with specified uid
    if (!orders[date][uid].meal) return null; // user doesn't select any dish
    const dishes = {};
    const { meal } = orders[date][uid];
    Object.keys(meal).forEach(key => {
      dishes[key] = menus[date][meal[key]] || standardDishes[meal[key]];
    });
    return dishes;
  }

  getRowData(rowData) {
    const { categories } = this.props;
    if (!rowData) return null;
    const dishes = [];
    Object.keys(categories).forEach(key => {
      dishes.push(!(rowData.dishes && rowData.dishes[key]) ? '' : rowData.dishes[key]);
    });

    const data = {
      orderNumber: rowData.orderNumber,
      canceled: rowData.canceled,
      name: rowData.name,
      note: rowData.note ? rowData.note : '-',
      dishes,
    };
    return data;
  }

  getStandardDish(dishes) {
    for (let i = 0; i < dishes.length; i++) {
      if (dishes[i] && dishes[i].standard) return dishes[i].name;
    }
    return '-';
  }

  handleExportToExcelClick() {
    const { weekDates } = this.state;
    tablesToExcel(
      this.tableIDs,
      weekDays,
      `Work&Co${ formatDateSr(weekDates[0]) }-${ formatDateSr(weekDates[4]) }.xls`);
  }

  handleSliderButtonClick(event, offset) {
    const weekOffset = this.state.weekOffset + offset;
    const weekDates = this.getChoosenWeek(weekOffset);
    const tablesData = this.getTablesData(this.props.orders, weekDates);

    this.setState({
      weekOffset,
      weekDates,
      tablesData,
    });
  }

  tableOrders(orders, date) {
    const { users } = this.props;
    if (!orders[date]) return null;
    const orderData = [];
    Object.keys(users).forEach((uid, index) => {
      orderData.push({
        orderNumber: index + 1,
        name: users[uid].username,
        canceled: !orders[date][uid],
        dishes: this.getUserOrderedDishes(uid, date, orders),
        note: orders[date][uid] && orders[date][uid].note,
        standardDish: '',
      });
    });
    return orderData;
  }

  renderMealColumns(dishes, canceled = false) {
    if (!dishes) return null;
    return dishes.map((dish, index) => {
      return <td data-style={ canceled ? 'none' : '' } key={ index }>{ (dish && !dish.standard) ? dish.name : '-' }</td>;
    });
  }

  renderSingleRow(rowData) {
    if (rowData.canceled) {
      return (
        <tr key={ rowData.orderNumber }>
          <td data-style='none'>{ rowData.orderNumber }</td>
          <td data-style='none'>{ rowData.name }</td>
          { this.renderMealColumns(rowData.dishes, true) }
          <td data-style='none'>{ this.getStandardDish(rowData.dishes) }</td>
          <td data-style='none'>{ rowData.note }</td>
        </tr>
      );
    }
    return (
      <tr key={ rowData.orderNumber }>
        <td>{ rowData.orderNumber }</td>
        <td>{ rowData.name }</td>
        { this.renderMealColumns(rowData.dishes) }
        <td>{ this.getStandardDish(rowData.dishes) }</td>
        <td>{ rowData.note }</td>
      </tr>
    );
  }

  renderTableRows(data) {
    if (!data) return null;
    return (
      data.map((rowData) => {
        return this.renderSingleRow(this.getRowData(rowData));
      })
    );
  }

  renderHeaderRow(day, date) {
    return (
      <thead>
        <tr>
          <td />
          <td data-style='bold'>{ day }</td>
          <td data-style='bold'>{ date }</td>
        </tr>
        <tr>
          <th data-style='head'>R.B</th>
          <th data-style='head'>Ime i prezime</th>
          { this.renderHeaderCategories() }
          <th data-style='head'>Stalni meni</th>
          <th data-style='head'>NAPOMENA</th>
        </tr>
      </thead>
    );
  }

  renderHeaderCategories() {
    const { categories } = this.props;
    return Object.keys(categories).map((key, index) => {
      return (
        <th key={ index } data-style='head'>
          { categories[key].name }
        </th>
      );
    });
  }

  renderSingleTable(date, data, index) {
    return (
      <table key={ index } id={ this.tableIDs[index] } className='Export-table'>
        { this.renderHeaderRow(weekDays[index], formatDateSr(date)) }
        <tbody>
          { this.renderTableRows(data) }
        </tbody>
      </table>
    );
  }

  renderTables() {
    const { weekDates, tablesData } = this.state;
    return tablesData.map((data, index) => {
      return this.renderSingleTable(weekDates[index], data, index);
    });
  }

  renderWeekSlider() {
    const { weekDates } = this.state;
    return (
      <div className='Export-weekSlider'>
        <button onClick={ (e) => { this.handleSliderButtonClick(e, -1); } } className='Export-weekSlider-button'><img alt='prev' src={ back } /></button>
        <div>{ formatDateSr(weekDates[0]) } - { formatDateSr(weekDates[4]) }</div>
        <button onClick={ (e) => { this.handleSliderButtonClick(e, 1); } } className='Export-weekSlider-button'><img alt='next' src={ next } /></button>
      </div>
    );
  }

  render() {
    return (
      <div className='Admin-wrapper'>
        <div className='Export'>
          <AdminMenu />
          { this.renderWeekSlider() }
          { this.renderTables() }
          <RaisedButton
            label='Export to Excel'
            onClick={ this.handleExportToExcelClick }
          />
        </div>
      </div>
    );
  }
}
