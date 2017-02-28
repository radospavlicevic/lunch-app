import React, { Component, PropTypes } from 'react';
import { deleteDishFromOrder } from 'api/orders';
import Grid from 'components/Client/Grid';

export default class MenuSection extends Component {
  static propTypes = {
    dishes: PropTypes.object,
    category: PropTypes.object,
    selectedDate: PropTypes.string,
  }

  constructor() {
    super();

    this.handleCancelClick = this.handleCancelClick.bind(this);
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

  handleCancelClick() {
    const { selectedDate, category } = this.props;
    deleteDishFromOrder(selectedDate, category.key);
  }

  isMainDish() {
    const { category } = this.props;
    return category.key === 'main_dish';
  }

  renderTabs() {
    const { selectedTab } = this.state;
    return (
      <div className='MenuSection-tabWrapper'>
        <button
          className={ selectedTab === 'main' ? 'MenuSection-tab--selected' : 'MenuSection-tab' }
          onClick={ (e) => this.handleTabClick(e, 'main') }
        >
        Glavna jela</button>
        <button
          className={ selectedTab === 'standard' ? 'MenuSection-tab--selected' : 'MenuSection-tab' }
          onClick={ (e) => this.handleTabClick(e, 'standard') }
        >
        Standardni meni</button>
      </div>
    );
  }

  render() {
    const { category, selectedDate } = this.props;
    const { dishes } = this.state;
    return (
      <div className='MenuSection'>
        <p className='MenuSection-category'>{ category.name }</p>
        { this.isMainDish() && this.renderTabs() }
        <Grid dishes={ dishes } selectedDate={ selectedDate } />
        <button onClick={ this.handleCancelClick } className='ManuSection-cancelButton'>Cancel</button>
      </div>
    );
  }

}
