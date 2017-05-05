import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import AdminMenu from 'components/Admin/AdminMenu';
import Toggle from 'material-ui/Toggle';
import { Tabs, Tab } from 'material-ui/Tabs';
import DatePicker from 'material-ui/DatePicker';
import DishOverview from 'components/Admin/DishOverview';
import { dishOverviewTypes, DATE_PATTERN, formatDate } from 'utils/globals';
import { addOrUpdateMenu } from 'actions/menus';
import { switchMenuLock } from 'api/menus';
import { loadDishes, loadCategories, loadCaterings } from 'actions/meals';
import moment from 'moment';
import { observableModule } from 'components/Observable/ObservableModule';
import { getNoStandardDishesSearchSelector } from '../../selectors/dishes';
import CheckAdminRole from '../../decorators/AuthorizationDecorator';

@CheckAdminRole
@connect(state => ({
  caterings: state.meals.get('caterings'),
  categories: state.meals.get('categories'),
  dishes: getNoStandardDishesSearchSelector(state),
  menus: state.menus.get('menus'),
  selectedDate: state.orders.get('selectedDate'),
}))
export default class Menus extends Component {

  static propTypes = {
    caterings: PropTypes.object,
    categories: PropTypes.object,
    dishes: PropTypes.object,
    menus: PropTypes.object,
    selectedDate: PropTypes.string,
  }

  constructor(props) {
    super();

    this.state = {
      selectedTab: 'select_dishes',
      selectedDay: props.selectedDate,
    };

    this.handleDayChange = this.handleDayChange.bind(this);
    this.handleTabChange = this.handleTabChange.bind(this);
    this.handleLockToggle = this.handleLockToggle.bind(this);
  }

  componentWillMount() {
    this.setupFirebaseObservers();
    document.title = 'Menus, Admin - Yummy Yumzor';
  }

  setupFirebaseObservers() {
    const { selectedDay } = this.state;

    observableModule.addValueObserver('dishes', loadDishes);
    observableModule.addValueObserver(`menus/${ selectedDay }`, addOrUpdateMenu, 2);
    observableModule.addValueObserver('categories', loadCategories);
    observableModule.addValueObserver('caterings', loadCaterings);
  }

  updateFirebaseObservers(date) {
    observableModule.addValueObserver(`menus/${ date }`, addOrUpdateMenu, 2);
  }

  handleLockToggle() {
    const { menus } = this.props;
    const { selectedDay } = this.state;
    switchMenuLock(selectedDay, !menus[selectedDay].locked);
  }

  handleTabChange(value) {
    this.setState({
      selectedTab: value,
    });
  }

  handleDayChange(event, date) {
    this.setState({
      selectedDay: moment(date).format(DATE_PATTERN),
    });
    this.updateFirebaseObservers(moment(date).format(DATE_PATTERN));
  }

  selectedDateDishes() {
    const { menus } = this.props;
    const { selectedDay } = this.state;
    const selectedDateDishes = { ...menus[selectedDay] };
    delete selectedDateDishes.locked;
    return selectedDateDishes;
  }

  menuIsLocked() {
    const { menus } = this.props;
    const { selectedDay } = this.state;
    return (menus && menus[selectedDay] && menus[selectedDay].locked);
  }

  checkLockedScreen() {
    if (!this.menuIsLocked()) return '';
    return (
      <div className='u-locked'>
        <span>Locked</span>
        <span>Locked</span>
        <span>Locked</span>
      </div>
    );
  }

  renderTabs() {
    const { selectedTab, selectedDay } = this.state;
    const { caterings, categories, dishes, menus } = this.props;
    return (
      <Tabs
        value={ this.state.selectedTab }
        onChange={ this.handleTabChange }
      >
        <Tab label='Select dishes' value='select_dishes'>
          { this.checkLockedScreen() }
          <DishOverview
            key={ selectedTab }
            type={ dishOverviewTypes.SELECTABLE }
            caterings={ caterings }
            categories={ categories }
            dishes={ dishes }
            menus={ menus }
            lunchDay={ selectedDay }
          />
        </Tab>
        <Tab label='Overview' value='overview'>
          { this.checkLockedScreen() }
          <DishOverview
            key={ selectedTab }
            type={ dishOverviewTypes.REMOVABLE }
            caterings={ caterings }
            categories={ categories }
            dishes={ this.selectedDateDishes() }
            lunchDay={ selectedDay }
          />
        </Tab>
      </Tabs>
    );
  }

  renderDateView() {
    const { selectedTab, selectedDay } = this.state;
    if (selectedTab === 'select_dishes') {
      return (
        <div className='Menus-date'>
          <span>Choose lunch day: </span>
          <Toggle
            label={ 'Locked' }
            defaultToggled={ this.menuIsLocked() }
            className='Menus-lockToggle'
            onToggle={ this.handleLockToggle }
          />
          <DatePicker
            id='material-ui-date-picker'
            defaultDate={ moment(selectedDay, DATE_PATTERN).toDate() }
            autoOk={ true }
            onChange={ this.handleDayChange }
            formatDate={ formatDate }
          />
        </div>
      );
    } else if (selectedTab === 'overview') {
      return (
        <div className='Menus-date'>
          <span>Lunch day:</span>
          <h2>{ selectedDay }</h2>
        </div>
      );
    }
    return '';
  }

  render() {
    return (
      <div className='Admin-wrapper'>
        <AdminMenu />
        <div className='Menus'>
          <div className='Menus-wrapper'>
            { this.renderDateView() }
            { this.renderTabs() }
          </div>
        </div>
      </div>
    );
  }
}
