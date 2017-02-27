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
        selectedTab: 'main_dish',
        dishes: this.props.dishes,
      };
    } else {
      this.state = {
        selectedTab: 'none',
      };
    }
  }

  handleTabClick(event, tabId) {
    this.setState({
      selectedTab: tabId,
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
          className={ selectedTab === 'main_dish' ? 'MenuSection-tab--selected' : 'MenuSection-tab' }
          onClick={ (e) => this.handleTabClick(e, 'main_dish') }
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
    const { dishes, category } = this.props;
    return (
      <div className='MenuSection'>
        <p className='MenuSection-category'>{ category.name }</p>
        { this.isMainDish() && this.renderTabs() }
        <Grid dishes={ dishes } />
      </div>
    );
  }

}
