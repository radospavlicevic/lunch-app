import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { db } from 'utils/firebase_config';
import { checkAdminRole } from 'utils/routing';
import DatePicker from 'react-datepicker';
import DishOverview from 'components/Admin/DishOverview';
import { dishOverviewTypes, DATE_PATTERN } from 'utils/globals';
import { addDishInMenu, removeDishFromMenu, setMenuLock } from 'actions/menus';
import { switchMenuLock } from 'api/menus';
import { addOrUpdateDish, addOrUpdateCategory, addOrUpdateCatering } from 'actions/meals';
import moment from 'moment';

@connect(state => ({
  loggedInUser: state.login.get('loggedInUser'),
  caterings: state.meals.get('caterings'),
  categories: state.meals.get('categories'),
  dishes: state.meals.get('noStandardDishes'),
  menus: state.menus.get('menus'),
  selectedDate: state.orders.get('selectedDate'),
}))
export default class Menus extends Component {

  static propTypes = {
    loggedInUser: PropTypes.object,
    caterings: PropTypes.object,
    categories: PropTypes.object,
    dishes: PropTypes.object,
    menus: PropTypes.object,
    selectedDate: PropTypes.string,
    dispatch: PropTypes.func,
  }

  constructor(props) {
    super();

    this.state = {
      selectedTab: 'select_dishes',
      selectedDay: props.selectedDate,
    };

    this.handleDayChange = this.handleDayChange.bind(this);
    this.handleLockClick = this.handleLockClick.bind(this);
  }

  componentWillMount() {
    const { loggedInUser } = this.props;
    checkAdminRole(loggedInUser && loggedInUser.role);
    this.setupFirebaseObservers();
    document.title = 'Menus, Admin - Yummy Yumzor';
  }

  setupFirebaseObservers() {
    const { dispatch } = this.props;
    const { selectedDay } = this.state;

    db.ref('dishes').on('child_added', newDish => {
      dispatch(addOrUpdateDish(newDish.key, newDish.val()));
    });

    db.ref(`menus/${ selectedDay }`).on('child_added', newMenuDish => {
      dispatch(
        addDishInMenu(selectedDay, newMenuDish.key, newMenuDish.val())
      );
    });

    db.ref(`menus/${ selectedDay }`).on('child_removed', exMenuDish => {
      dispatch(removeDishFromMenu(selectedDay, exMenuDish.key));
    });

    db.ref(`menus/${ selectedDay }`).on('child_changed', menuLock => {
      dispatch(setMenuLock(selectedDay, menuLock.val()));
    });

    db.ref('caterings').on('child_added', newCatering => {
      dispatch(addOrUpdateCatering(newCatering.key, newCatering.val()));
    });

    db.ref('categories').on('child_added', newCategory => {
      dispatch(addOrUpdateCategory(newCategory.key, newCategory.val().name));
    });
  }

  updateFirebaseObservers(date) {
    const { dispatch } = this.props;

    db.ref(`menus/${ date }`).on('child_added', newMenuDish => {
      dispatch(addDishInMenu(date, newMenuDish.key, newMenuDish.val()));
    });

    db.ref(`menus/${ date }`).on('child_changed', menuLock => {
      dispatch(setMenuLock(date, menuLock.val()));
    });

    db.ref(`menus/${ date }`).on('child_removed', exMenuDish => {
      dispatch(removeDishFromMenu(date, exMenuDish.key));
    });
  }

  handleLockClick() {
    const { menus } = this.props;
    const { selectedDay } = this.state;
    switchMenuLock(selectedDay, !menus[selectedDay].locked);
  }

  handleTabClick(event, selected) {
    this.setState({
      selectedTab: selected,
    });
  }

  handleDayChange(date) {
    event.preventDefault();
    this.setState({
      selectedDay: date.format(DATE_PATTERN),
    });
    this.updateFirebaseObservers(date.format(DATE_PATTERN));
  }

  selectedDateDishes() {
    const { menus } = this.props;
    const { selectedDay } = this.state;
    const selectedDateDishes = { ...menus[selectedDay] };
    delete selectedDateDishes.locked;
    return selectedDateDishes;
  }

  renderTabs() {
    const { selectedTab } = this.state;
    return (
      <div className='Menus-tabWrapper'>
        <button className={ selectedTab === 'select_dishes' ? 'Menus-tabButton--active' : 'Menus-tabButton' } onClick={ (e) => this.handleTabClick(e, 'select_dishes') }>Select dishes</button>
        <button className={ selectedTab === 'overview' ? 'Menus-tabButton--active' : 'Menus-tabButton' } onClick={ (e) => this.handleTabClick(e, 'overview') }>Overview</button>
      </div>
    );
  }

  renderTabContent() {
    const { selectedTab, selectedDay } = this.state;
    const { caterings, categories, dishes, menus } = this.props;
    if (selectedTab === 'select_dishes') {
      return (
        <DishOverview
          key={ selectedTab }
          type={ dishOverviewTypes.SELECTABLE }
          caterings={ caterings }
          categories={ categories }
          dishes={ dishes }
          menus={ menus }
          lunchDay={ selectedDay }
        />
      );
    } else if (selectedTab === 'overview') {
      return (
        <DishOverview
          key={ selectedTab }
          type={ dishOverviewTypes.REMOVABLE }
          caterings={ caterings }
          categories={ categories }
          dishes={ this.selectedDateDishes() }
          lunchDay={ selectedDay }
        />
      );
    }
    return '';
  }

  renderDateView() {
    const { menus } = this.props;
    const { selectedTab, selectedDay } = this.state;
    if (selectedTab === 'select_dishes') {
      return (
        <div className='Menus-date'>
          <span>Choose lunch day: </span>
          <DatePicker
            selected={ moment(selectedDay, DATE_PATTERN) }
            onChange={ this.handleDayChange }
            dateFormat={ DATE_PATTERN }
            readOnly
          />
          <button className='Menus-lockButton' onClick={ this.handleLockClick }>
            { menus[selectedDay] && menus[selectedDay].locked ? 'Unlock Menu' : 'Lock Menu' }
          </button>
        </div>
      );
    } else if (selectedTab === 'overview') {
      return (
        <div className='Menus-date'>
          <span>Lunch day: </span>
          <span><b>{ selectedDay }</b></span>
        </div>
      );
    }
    return '';
  }

  render() {
    return (
      <div className='Menus Admin-wrapper'>
        <h1>Menus</h1>
        <div className='Menus-wrapper'>
          { this.renderDateView() }
          { this.renderTabs() }
          { this.renderTabContent() }
        </div>
      </div>
    );
  }
}
