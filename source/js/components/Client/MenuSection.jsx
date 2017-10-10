import React, { Component, PropTypes } from 'react';
import Grid from 'components/Client/Grid';
import { Tabs, Tab } from 'material-ui/Tabs';
import { userSignedIn } from 'api/auth';
import ComposedComponent from 'decorators/AppBreakpointsDecorator';
import { connect } from 'react-redux';

@ComposedComponent
@connect(state => ({
  breakpoint: state.app.get('breakpoint'),
  loggedInUser: state.login.get('loggedInUser'),
}))
export default class MenuSection extends Component {
  static propTypes = {
    dishes: PropTypes.object,
    category: PropTypes.object,
    orders: PropTypes.object,
    selectedDate: PropTypes.string,
    breakpoint: PropTypes.string,
  }

  componentWillMount() {
    this.handleTabClick = this.handleTabClick.bind(this);
    this.reinitState();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.dishes !== nextProps.dishes || this.props.orders !== nextProps.orders) {
      this.reinitState(nextProps.dishes, true, nextProps.orders);
    }
  }

  setTabBasedState(selectedTab, visibleDishes, update) {
    if (update) {
      this.setState({
        selectedTab,
        dishes: this.filterMainDishes(selectedTab, visibleDishes),
      });
    } else {
      this.state = {
        selectedTab,
        dishes: this.filterMainDishes(selectedTab, visibleDishes),
      };
    }
  }

  reinitState(nextDishes, update = false, nextOrders) {
    const dishes = nextDishes || this.props.dishes;
    if (this.isMainDish()) {
      this.selectProperTab(dishes, update, nextOrders);
    } else {
      this.initNoMainDishState(dishes, update);
    }
  }

  initNoMainDishState(dishes, update) {
    if (update) {
      this.setState({
        selectedTab: 'none',
        dishes,
      });
    } else {
      this.state = {
        selectedTab: 'none',
        dishes,
      };
    }
  }

  hasDishesSelected(nextOrders) {
    const { orders, selectedDate } = this.props;
    const currentOrder = nextOrders || orders;
    if (!currentOrder[selectedDate]) return false;
    if (!currentOrder[selectedDate][userSignedIn().uid]) return false;
    if (!currentOrder[selectedDate][userSignedIn().uid].meal) return false;
    if (!currentOrder[selectedDate][userSignedIn().uid].meal.main_dish) return false;
    return true;
  }

  isNoteAdded(nextOrders) {
    const { selectedDate } = this.props;
    if (!nextOrders[selectedDate]) return false;
    if (!nextOrders[selectedDate][userSignedIn().uid]) return false;
    if (!nextOrders[selectedDate][userSignedIn().uid].note && !nextOrders[selectedDate][userSignedIn().uid].note === '') return false;
    return true;
  }

  selectProperTab(actualDishes, update = false, nextOrders) {
    if (!this.hasDishesSelected(nextOrders)) {
      const selectedTab = update ? this.state.selectedTab : 'main';
      this.setTabBasedState(selectedTab, actualDishes, update);
      return;
    }
    const isStandard = this.isMainDishTypeStandard(actualDishes, nextOrders);
    let activeTab = isStandard ? 'standard' : 'main';
    if (nextOrders) {
      if (this.isNoteAdded(nextOrders)) {
        activeTab = this.state.selectedTab;
      }
    }
    this.setTabBasedState(activeTab, actualDishes, update);
  }

  isMainDishTypeStandard(mainDishes, nextOrders) {
    const { selectedDate } = this.props;
    const orders = nextOrders || this.props.orders;
    const dishGUID = orders[selectedDate][userSignedIn().uid]
      && orders[selectedDate][userSignedIn().uid].meal
      && orders[selectedDate][userSignedIn().uid].meal.main_dish;
    return (mainDishes[dishGUID] ? mainDishes[dishGUID].standard : false);
  }

  isMainDish() {
    const { category } = this.props;
    return category.key === 'main_dish';
  }

  handleTabClick(value) {
    const visibleDishes = this.filterMainDishes(value, this.props.dishes);
    this.setState({
      selectedTab: value,
      dishes: visibleDishes,
    });
  }

  filterMainDishes(filterId, dishes) {
    const filteredDishes = {};
    if (!dishes) return {};
    Object.keys(dishes).forEach(key => {
      if (filterId === 'standard' && dishes[key].standard) {
        filteredDishes[key] = dishes[key];
      } else if (filterId === 'main' && !dishes[key].standard) {
        filteredDishes[key] = dishes[key];
      }
    });
    return filteredDishes;
  }

  noDishes() {
    const { dishes } = this.state;
    return dishes && Object.keys(dishes).length === 0;
  }

  renderTabs() {
    const { breakpoint } = this.props;

    return (
      <div className='MenuSection-tabWrapper'>
        <Tabs
          onChange={ this.handleTabClick }
          value={ this.state.selectedTab }
        >
          <Tab
            style={ { fontFamily: 'Avenir', fontSize: breakpoint === 'sm' ? '0.7rem' : '0.8rem' } }
            label='Glavna jela'
            value='main'
            className='MenuSection-tab'
          />
          <Tab
            style={ { fontFamily: 'Avenir', fontSize: breakpoint === 'sm' ? '0.7rem' : '0.8rem' } }
            label='Standardni meni'
            value='standard'
            className='MenuSection-tab'
          />
        </Tabs>
      </div>
    );
  }

  render() {
    const { category, selectedDate, orders } = this.props;
    const { dishes } = this.state;
    return (
      <div className={ this.noDishes() ? 'u-invisible' : 'MenuSection' }>
        <p className='MenuSection-category'>{ category.name }</p>
        { this.isMainDish() && this.renderTabs() }
        <Grid
          dishes={ dishes }
          selectedDate={ selectedDate }
          category={ category }
          orders={ orders }
        />
      </div>
    );
  }
}
