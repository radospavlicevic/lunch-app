import React, { Component, PropTypes } from 'react';
import Grid from 'components/Client/Grid';
import { Tabs, Tab } from 'material-ui/Tabs';
import ComposedComponent from 'decorators/AppBreakpointsDecorator';
import { connect } from 'react-redux';

@ComposedComponent
@connect(state => ({
  breakpoint: state.app.get('breakpoint'),
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
    if (this.isMainDish()) {
      this.state = {
        selectedTab: 'main',
        dishes: this.filterMainDishes('main', dishes),
      };
    } else {
      this.state = {
        selectedTab: 'none',
        dishes,
      };
    }
  }

  componentWillReceiveProps(nextProps) {
    const { dishes } = this.props;
    const { selectedTab } = this.state;
    if (nextProps.dishes !== dishes) {
      this.setState({
        selectedTab,
        dishes: (this.isMainDish()) ?
          this.filterMainDishes(selectedTab, nextProps.dishes) : nextProps.dishes,
      });
    }
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

  handleTabClick(event, tabId) {
    const visibleDishes = this.filterMainDishes(tabId, this.props.dishes);
    this.setState({
      selectedTab: tabId,
      dishes: visibleDishes,
    });
  }

  isMainDish() {
    const { category } = this.props;
    return category.key === 'main_dish';
  }

  noDishes() {
    const { dishes } = this.state;
    return dishes && Object.keys(dishes).length === 0;
  }

  renderTabs() {
    const { breakpoint } = this.props;
    return (
      <div className='MenuSection-tabWrapper'>
        <Tabs>
          <Tab
            style={ { fontFamily: 'Avenir', fontSize: breakpoint === 'sm' ? '0.7rem' : '0.8rem' } }
            label='Glavna jela'
            onClick={ (e) => this.handleTabClick(e, 'main') }
            className='MenuSection-tab'
          />
          <Tab
            style={ { fontFamily: 'Avenir', fontSize: breakpoint === 'sm' ? '0.7rem' : '0.8rem' } }
            label='Standardni meni'
            onClick={ (e) => this.handleTabClick(e, 'standard') }
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
