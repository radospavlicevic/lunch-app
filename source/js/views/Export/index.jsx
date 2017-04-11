import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { db } from 'utils/firebase_config';
import { DATE_PATTERN, formatDateSr, weekDays } from 'utils/globals';
import { tablesToExcel } from 'utils/excel_export';
import AdminMenu from 'components/Admin/AdminMenu';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';
import { addUser } from 'actions/users';
import { addOrUpdateCategory, addOrUpdateDish } from 'actions/meals';
import { addDishInMenu } from 'actions/menus';
import { updateOrder } from 'actions/orders';
import moment from 'moment';
import CheckAdminRole from '../../decorators/AuthorizationDecorator';
import back from '../../../assets/img/back.png';
import next from '../../../assets/img/next.png';

@CheckAdminRole
@connect(state => ({
  menus: state.menus.get('menus'),
  categories: state.meals.get('categories'),
  standardDishes: state.meals.get('standardDishes'),
  orders: state.orders.get('orders'),
  users: state.users.get('users'),
}))
export default class Export extends Component {
  static propTypes = {
    menus: PropTypes.object,
    standardDishes: PropTypes.object,
    categories: PropTypes.object,
    orders: PropTypes.object,
    users: PropTypes.object,
    dispatch: PropTypes.func,
  }

  constructor() {
    super();

    this.handleExportToExcelClick = this.handleExportToExcelClick.bind(this);
    this.tableIDs = ['mon', 'tue', 'wed', 'thu', 'fri'];
    this.state = {
      weekOffset: -1,
      weekDates: this.getChoosenWeek(),
      tablesData: [],
      orderCounts: [],
    };
  }

  componentWillMount() {
    this.setupFirebaseObservers();
    document.title = 'Export - Yummy Yumzor';
  }

  componentWillUpdate(nextProps, nextState) {
    const { orders, menus } = this.props;
    const { weekDates } = this.state;
    if (nextProps.orders !== orders || nextProps.menus !== menus) {
      this.setState({
        tablesData: this.getTablesData(),
      });
    }

    if (nextState.weekDates !== weekDates) {
      this.setObserversForChoosenWeek(nextState.weekDates, true);
    }
  }

  setupFirebaseObservers() {
    const { dispatch } = this.props;

    db.ref('users').on('child_added', newUser => {
      dispatch(addUser(newUser.key, newUser.val()));
    });

    db.ref('categories').on('child_added', newCategory => {
      dispatch(addOrUpdateCategory(newCategory.key, newCategory.val().name));
    });

    db.ref('dishes').on('child_added', newDish => {
      dispatch(addOrUpdateDish(newDish.key, newDish.val()));
    });

    this.setObserversForChoosenWeek();

    // db.ref(`orders/${ reportDate }`).on('child_removed', order => {
    //   dispatch(cancelOrder(reportDate, order.key));
    // });
  }

  setObserversForChoosenWeek(week = null, update = false) {
    const weekDates = week || this.state.weekDates;
    for (let i = 0; i < weekDates.length; i++) {
      this.setObserverFor(weekDates[i], i, update);
    }
  }

  getChoosenWeek(offset = -1) {
    const weekDates = [];
    const startWeekDay = moment().add(offset, 'weeks').startOf('isoWeek');
    weekDates.push(startWeekDay.format(DATE_PATTERN));
    for (let i = 1; i < 5; i++) {
      weekDates.push(startWeekDay.add(1, 'day').format(DATE_PATTERN));
    }
    return weekDates;
  }

  setObserverFor(day, index, update) {
    const { dispatch } = this.props;
    db.ref(`menus/${ day }`).on('child_added', newMenuDish => {
      dispatch(addDishInMenu(day, newMenuDish.key, newMenuDish.val()));
    });

    db.ref(`orders/${ day }`).on('child_added', order => {
      dispatch(updateOrder(day, order.key, order.val()));
    });

    db.ref(`orders/${ day }`).on('value', snapshot => {
      const counts = this.state.orderCounts;
      counts[index] = snapshot.numChildren();
      this.setState({
        orderCounts: counts,
      });
    });
  }

  getTablesData(weekDates = null) {
    const data = [];
    const week = weekDates || this.state.weekDates;
    for (let i = 0; i < week.length; i++) {
      data.push(this.tableOrders(week[i]));
    }
    return data;
  }

  getUserOrderedDishes(uid, date) {
    const { orders, menus, standardDishes } = this.props;
    if (!orders[date][uid]) return null;
    if (!orders[date][uid].meal) return null;
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
    tablesToExcel(this.tableIDs, weekDays, 'WorkAndCoExcel.xls', 'Yummy Yumzor');
  }

  handleSliderButtonClick(event, offset) {
    const weekOffset = this.state.weekOffset + offset;
    const weekDates = this.getChoosenWeek(weekOffset);
    const tablesData = this.getTablesData(weekDates);

    this.setState({
      weekOffset,
      weekDates,
      tablesData,
    });
  }

  tableOrders(date) {
    const { orders, users } = this.props;
    if (!orders[date]) return null;
    const orderData = [];
    Object.keys(users).forEach((uid, index) => {
      orderData.push({
        orderNumber: index + 1,
        name: users[uid].username,
        canceled: !orders[date][uid],
        dishes: this.getUserOrderedDishes(uid, date),
        note: orders[date][uid] && orders[date][uid].note,
        standardDish: '',
      });
    });
    return orderData;
  }

  ordersLoading() {
    const { orders } = this.props;
    const { weekDates, orderCounts } = this.state;
    for (let i = 0; i < weekDates.length; i++) {
      if (orderCounts[i] === undefined) return true;
      if (!orders[weekDates[i]] && orderCounts[i] !== 0) return true;
      if (orders[weekDates[i]] &&
        Object.keys(orders[weekDates[i]]).length !== orderCounts[i]) return true;
    }
    return false;
  }

  renderMealColumns(dishes) {
    if (!dishes) return null;
    return dishes.map((dish, index) => {
      return <td key={ index }>{ (dish && !dish.standard) ? dish.name : '-' }</td>;
    });
  }

  renderSingleRow(rowData) {
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
          <td>{ day }</td>
          <td>{ date }</td>
        </tr>
        <tr>
          <th>R.B</th>
          <th>Ime i prezime</th>
          { this.renderHeaderCategories() }
          <th>Stalni meni</th>
          <th>NAPOMENA</th>
        </tr>
      </thead>
    );
  }

  renderHeaderCategories() {
    const { categories } = this.props;
    return Object.keys(categories).map((key, index) => {
      return (
        <th key={ index }>
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
    const loading = this.ordersLoading();
    return (
      <div className='Admin-wrapper'>
        <div className='Export'>
          <AdminMenu />
          { loading &&
            <div className='Export-loadingWrapper'>
              <CircularProgress className='Export-loading' size={ 80 } thickness={ 5 } />
            </div>
          }
          { this.renderWeekSlider() }
          { this.renderTables() }
          { !loading &&
            <RaisedButton
              label='Export to Excel'
              onClick={ this.handleExportToExcelClick }
            />
          }
        </div>
      </div>
    );
  }
}
