
import React, { Component, PropTypes } from 'react';
import { dishOverviewTypes } from 'utils/globals';
import SelectableDishItem from './SelectableDishItem';
import RemovableDishItem from './RemovableDishItem';
import EditableDishItem from './EditableDishItem';

export default class DishOverview extends Component {
  static propTypes = {
    type: PropTypes.string,
    dishes: PropTypes.object,
    categories: PropTypes.object,
    caterings: PropTypes.object,
    menus: PropTypes.object,
    lunchDay: PropTypes.string,
  }

  componentWillMount() {
    this.state = {
      filters: {
        catering: 'all',
        category: 'all',
        search: '',
      },
      filtered: this.props.dishes,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { dishes } = this.props;
    const { filters } = this.state;
    if (nextProps.dishes !== dishes) {
      this.setState({
        filtered: this.filterDishes(nextProps.dishes, filters),
      });
    }
  }

  handleFilterChange(event, filterName) {
    const { dishes } = this.props;
    const nextFilters = {
      ...this.state.filters,
      [filterName]: event.target.value,
    };

    const filtered = this.filterDishes(dishes, nextFilters);

    this.setState({
      filters: nextFilters,
      filtered,
    });
  }

  filterDishes(dishes, nextFilters) {
    let filtered = dishes;

    filtered = this.filterByCatering(filtered, nextFilters.catering);
    filtered = this.filterByCategory(filtered, nextFilters.category);
    filtered = this.filterBySearchWord(filtered, nextFilters.search);

    return filtered;
  }

  filterByCatering(dishes, catering) {
    const filteredDishes = {};
    if (catering === 'all') {
      return dishes;
    }

    Object.keys(dishes).forEach((key) => {
      if (dishes[key].catering === catering) {
        filteredDishes[key] = dishes[key];
      }
    });

    return filteredDishes;
  }

  filterByCategory(dishes, category) {
    const filteredDishes = {};
    if (category === 'all') {
      return dishes;
    }
    if (category === 'standard') {
      Object.keys(dishes).forEach((key) => {
        if (dishes[key].standard) {
          filteredDishes[key] = dishes[key];
        }
      });
    } else {
      Object.keys(dishes).forEach((key) => {
        if (dishes[key].category === category) {
          filteredDishes[key] = dishes[key];
        }
      });
    }

    return filteredDishes;
  }

  filterBySearchWord(dishes, searchWord) {
    const filteredDishes = {};
    Object.keys(dishes).forEach((key) => {
      if (dishes[key].name.toLowerCase().includes(searchWord.toLowerCase())) {
        filteredDishes[key] = dishes[key];
      }
    });
    return filteredDishes;
  }

  renderCateringSelect() {
    const { caterings } = this.props;
    const { filters } = this.state;
    return (
      <select className='DishOverview-filter' value={ filters.catering } onChange={ (e) => this.handleFilterChange(e, 'catering') }>
        <option key={ -1 } value='all'>All</option>
        {
          Object.keys(caterings).map((key, index) => {
            return <option key={ index } value={ key }>{ caterings[key].name }</option>;
          })
        }
      </select>
    );
  }

  renderCategorySelect() {
    const { categories, type } = this.props;
    const { filters } = this.state;
    const standardOptionVisible = type === dishOverviewTypes.EDITABLE;
    return (
      <select className='DishOverview-filter' value={ filters.category } onChange={ (e) => this.handleFilterChange(e, 'category') }>
        <option key={ -1 } value='all'>All</option>
        { standardOptionVisible &&
          <option key={ -2 } value='standard'>Standardni meni</option>
        }
        {
          Object.keys(categories).map((key, index) => {
            return <option key={ index } value={ key }>{ categories[key].name }</option>;
          })
        }
      </select>
    );
  }

  renderFilters() {
    const { search } = this.state.filters;
    return (
      <div className='DishOverview-filterWrapper'>
        <span>Filters: </span>
        <input
          onChange={ (e) => this.handleFilterChange(e, 'search') }
          value={ search }
          className='DishOverview-filter'
          placeholder='Search'
        />
        { this.renderCateringSelect() }
        { this.renderCategorySelect() }
      </div>
    );
  }

  renderDishItem(index, key, data) {
    const { type, lunchDay, menus } = this.props;
    if (type === dishOverviewTypes.SELECTABLE) {
      return (
        <SelectableDishItem
          key={ key }
          dishKey={ key }
          dishData={ data }
          lunchDay={ lunchDay }
          menus={ menus }
        />
      );
    } else if (type === dishOverviewTypes.EDITABLE) {
      return (
        <EditableDishItem
          key={ index }
          dishKey={ key }
          dishData={ data }
        />
      );
    } else if (type === dishOverviewTypes.REMOVABLE) {
      return (
        <RemovableDishItem
          key={ index }
          dishKey={ key }
          dishData={ data }
          lunchDay={ lunchDay }
        />
      );
    }
    return '';
  }

  renderDishes() {
    const { filtered } = this.state;
    if (!filtered) {
      return (
        <div className='Message--info'>There are no dishes added. </div>
      );
    }

    return Object.keys(filtered).map((key, index) => {
      return this.renderDishItem(index, key, filtered[key]);
    });
  }

  renderTitle() {
    const { type } = this.props;
    if (type === dishOverviewTypes.SELECTABLE) {
      return <h2>Select Dishes</h2>;
    } else if (type === dishOverviewTypes.EDITABLE) {
      return <h2>All Dishes</h2>;
    } else if (type === dishOverviewTypes.REMOVABLE) {
      return <h2>Selected Dishes</h2>;
    }
    return '';
  }

  render() {
    return (
      <div className='DishOverview'>
        <div className='DishOverview-header'>
          { this.renderTitle() }
          { this.renderFilters() }
        </div>
        <div className='DishItem-wrapper'>
          { this.renderDishes() }
        </div>
      </div>
    );
  }
}
