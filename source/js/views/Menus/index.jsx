import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { db } from 'utils/firebase_config';
import { checkAdminRole } from 'utils/routing';
import DatePicker from 'react-datepicker';
import DishOverview from 'components/Admin/DishOverview';
import { dishOverviewTypes } from 'utils/globals';
import { addDishInMenu, removeDishFromMenu } from 'actions/menus';
import { addOrUpdateDish, addCategory, addCatering } from 'actions/meals';
import moment from 'moment';

@connect(state => ({
  loggedInUser: state.login.get('loggedInUser'),
  caterings: state.meals.get('caterings'),
  categories: state.meals.get('categories'),
  dishes: state.meals.get('noStandardDishes'),
  menus: state.menus.get('menus'),
}))
export default class Menus extends Component {

  static propTypes = {
    loggedInUser: PropTypes.object,
    caterings: PropTypes.object,
    categories: PropTypes.object,
    dishes: PropTypes.object,
    menus: PropTypes.object,
    dispatch: PropTypes.func,
  }

  constructor() {
    super();
    this.state = {
      selectedTab: 'select_dishes',
      selectedDay: moment(),
    };

    this.datePattern = 'DD-MM-YYYY';
    this.handleDayChange = this.handleDayChange.bind(this);
  }

  componentWillMount() {
    const { loggedInUser } = this.props;
    checkAdminRole(loggedInUser && loggedInUser.role);
    this.setupFirebaseObservers();
  }

  setupFirebaseObservers() {
    const { dispatch } = this.props;
    const { selectedDay } = this.state;

    db.ref('dishes').on('child_added', newDish => {
      dispatch(addOrUpdateDish(newDish.key, newDish.val()));
    });

    db.ref(`menus/${ selectedDay.format(this.datePattern) }`).on('child_added', newMenuDish => {
      dispatch(
        addDishInMenu(selectedDay.format(this.datePattern), newMenuDish.key, newMenuDish.val())
      );
    });

    db.ref(`menus/${ selectedDay.format(this.datePattern) }`).on('child_removed', exMenuDish => {
      dispatch(removeDishFromMenu(selectedDay.format(this.datePattern), exMenuDish.key));
    });

    db.ref('caterings').on('child_added', newCatering => {
      dispatch(addCatering(newCatering.key, newCatering.val()));
    });

    db.ref('categories').on('child_added', newCategory => {
      dispatch(addCategory(newCategory.key, newCategory.val().name));
    });
  }

  updateFirebaseObservers(date) {
    const { dispatch } = this.props;

    db.ref(`menus/${ date }`).on('child_added', newMenuDish => {
      dispatch(addDishInMenu(date, newMenuDish.key, newMenuDish.val()));
    });

    db.ref(`menus/${ date }`).on('child_removed', exMenuDish => {
      dispatch(removeDishFromMenu(date, exMenuDish.key));
    });
  }

  handleTabClick(event, selected) {
    this.setState({
      selectedTab: selected,
    });
  }

  handleDayChange(date) {
    event.preventDefault();
    this.setState({
      selectedDay: date,
    });
    const formattedDate = date.format(this.datePattern);
    this.updateFirebaseObservers(formattedDate);
  }

  selectedDateDishes() {
    const { menus } = this.props;
    const { selectedDay } = this.state;
    return menus[selectedDay.format(this.datePattern)];
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
          lunchDay={ selectedDay.format(this.datePattern) }
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
          lunchDay={ selectedDay.format(this.datePattern) }
        />
      );
    }
    return '';
  }

  renderDateView() {
    const { selectedTab, selectedDay } = this.state;
    if (selectedTab === 'select_dishes') {
      return (
        <div className='Menus-date'>
          <span>Choose lunch day: </span>
          <DatePicker
            selected={ this.state.selectedDay }
            onChange={ this.handleDayChange }
            dateFormat='DD-MM-YYYY'
            readOnly
          />
          { !selectedDay && <span className='Message--error'>No lunch day is selected. </span> }
        </div>
      );
    } else if (selectedTab === 'overview') {
      return (
        <div className='Menus-date'>
          <span>Lunch day: </span>
          <span><b>{ selectedDay && selectedDay.format(this.datePattern) }</b></span>
          { !selectedDay && <span className='Message--error'>No lunch day is selected. </span> }
        </div>
      );
    }
    return '';
  }

  render() {
    return (
      <div className='Menus'>
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
