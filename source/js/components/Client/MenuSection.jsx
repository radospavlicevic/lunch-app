import React, { Component, PropTypes } from 'react';

import Grid from 'components/Client/Grid';

export default class MenuSection extends Component {
  static propTypes = {
    dishes: PropTypes.object,
    category: PropTypes.object,
  }

  componentWillMount() {
    if (this.isMainDish()) {
      this.state = {
        selectedTab: 'main',
        dishes: this.filterMainDishes('main'),
      };
    } else {
      this.state = {
        selectedTab: 'none',
        dishes: this.props.dishes,
      };
    }
  }

  filterMainDishes(filterId) {
    const { dishes } = this.props;
    const filteredDishes = {};
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
    const visibleDishes = this.filterMainDishes(tabId);
    this.setState({
      selectedTab: tabId,
      dishes: visibleDishes,
    });
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
    const { category } = this.props;
    const { dishes } = this.state;
    return (
      <div className='MenuSection'>
        <p className='MenuSection-category'>{ category.name }</p>
        { this.isMainDish() && this.renderTabs() }
        <Grid dishes={ dishes } />
      </div>
    );
  }

}
