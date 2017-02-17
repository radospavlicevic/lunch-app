
import React, { Component, PropTypes } from 'react';
import { dishOverviewTypes } from 'utils/globals';
import DishItem from './DishItem';
import SelectableDishItem from './SelectableDishItem';
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

  constructor() {
    super();

    this.state = {
      filters: {
        catering: 'all',
        category: 'all',
        search: '',
      },
    };
  }

  handleFilterChange(event, filterName) {
    this.setState({
      filters: {
        ...this.state.filters,
        [filterName]: event.target.value,
      },
    });
  }

  filterByCatering(dishes) {
    const { filters } = this.state;
    const filteredDishes = {};
    if (filters.catering === 'all') return dishes;
    Object.keys(dishes).forEach((key) => {
      if (dishes[key].catering === filters.catering) {
        filteredDishes[key] = dishes[key];
      }
    });
    return filteredDishes;
  }

  filterByCategory(dishes) {
    const { filters } = this.state;
    const filteredDishes = {};
    if (filters.category === 'all') return dishes;
    Object.keys(dishes).forEach((key) => {
      if (dishes[key].category === filters.category) {
        filteredDishes[key] = dishes[key];
      }
    });
    return filteredDishes;
  }

  filterBySearchWord(dishes) {
    const { filters } = this.state;
    const filteredDishes = {};
    Object.keys(dishes).forEach((key) => {
      if (dishes[key].name.toLowerCase().includes(filters.search.toLowerCase())) {
        filteredDishes[key] = dishes[key];
      }
    });
    return filteredDishes;
  }

  filteredDishes() {
    const { dishes } = this.props;
    if (!dishes) return null;
    return this.filterBySearchWord(this.filterByCategory(this.filterByCatering(dishes)));
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
    const { categories } = this.props;
    const { filters } = this.state;
    return (
      <select className='DishOverview-filter' value={ filters.category } onChange={ (e) => this.handleFilterChange(e, 'category') }>
        <option key={ -1 } value='all'>All</option>
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
    const { type } = this.props;
    if (type === dishOverviewTypes.SELECTABLE) {
      const { lunchDay, menus } = this.props;
      return (
        <SelectableDishItem
          key={ index } dishKey={ key } dishData={ data } lunchDay={ lunchDay } menus={ menus }
        />
      );
    } else if (type === dishOverviewTypes.EDITABLE) {
      return <EditableDishItem key={ index } dishKey={ key } dishData={ data } />;
    } else if (type === dishOverviewTypes.PLAIN) {
      return <DishItem key={ index } dishKey={ key } dishData={ data } />;
    }
    return '';
  }

  renderDishes() {
    const filteredDishes = this.filteredDishes();
    if (!filteredDishes) return <div className='Message--info'>There is no dishes added. </div>;
    return filteredDishes && Object.keys(filteredDishes).map((key, index) => {
      const data = {
        'catering': filteredDishes[key].catering,
        'category': filteredDishes[key].category,
        'name': filteredDishes[key].name,
        'description': filteredDishes[key].description,
        'price': filteredDishes[key].price,
      };
      return this.renderDishItem(index, key, data);
    });
  }

  renderTitle() {
    const { type } = this.props;
    if (type === dishOverviewTypes.SELECTABLE) {
      return <h2>Select Dishes</h2>;
    } else if (type === dishOverviewTypes.EDITABLE) {
      return <h2>All Dishes</h2>;
    } else if (type === dishOverviewTypes.PLAIN) {
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
