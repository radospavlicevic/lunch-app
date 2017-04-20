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
    const { dishes } = this.props;
    this.handleTabClick = this.handleTabClick.bind(this);
    if (this.isMainDish()) {
      this.selectProperTab();
    } else {
      this.state = {
        selectedTab: 'none',
        dishes,
      };
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.dishes !== this.props.dishes) {
      this.selectProperTab();
    }
  }

  setTabBasedState(selectedTab, visibleDishes, init) {
    if (init) {
      this.state = {
        selectedTab,
        dishes: this.filterMainDishes(selectedTab, visibleDishes),
      };
    } else {
      this.setState({
        selectedTab,
        dishes: this.filterMainDishes(selectedTab, visibleDishes),
      });
    }
  }

  hasDishesSelected() {
    const { orders, selectedDate } = this.props;
    if (!orders[selectedDate]) return false;
    if (!orders[selectedDate][userSignedIn().uid]) return false;
    if (!orders[selectedDate][userSignedIn().uid].meal) return false;
    return true;
  }

  selectProperTab(nextDishes, init = false) {
    const { dishes } = this.props;
    const actualDishes = nextDishes || dishes;
    if (!this.hasDishesSelected()) {
      this.setTabBasedState('main', actualDishes, init);
      return;
    }
    let isStandard = false;
    isStandard = this.isMainDishTypeStandard(actualDishes);
    const activeTab = isStandard ? 'standard' : 'main';
    this.setTabBasedState(activeTab, actualDishes, init);
  }

  isMainDishTypeStandard(mainDishes) {
    const { orders, selectedDate } = this.props;
    const dishGUID = orders[selectedDate][userSignedIn().uid].meal.main_dish;
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
      <div className={ this.noDishes() ? 'u-invisible' : 'MenuSection' } >
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
