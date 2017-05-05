import React, { Component, PropTypes } from 'react';
import { Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import { dishOverviewTypes } from 'utils/globals';
import CircularProgress from 'material-ui/CircularProgress';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
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
    this.handleSearchFilterChange = this.handleSearchFilterChange.bind(this);
    this.handleCategoryFilterChange = this.handleCategoryFilterChange.bind(this);
    this.handleCateringFilterChange = this.handleCateringFilterChange.bind(this);

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

  handleCategoryFilterChange(event, index, value) {
    const { dishes } = this.props;
    const nextFilters = {
      ...this.state.filters,
      category: value,
    };

    const filtered = this.filterDishes(dishes, nextFilters);

    this.setState({
      filters: nextFilters,
      filtered,
    });
  }

  handleCateringFilterChange(event, index, value) {
    const { dishes } = this.props;
    const nextFilters = {
      ...this.state.filters,
      catering: value,
    };

    const filtered = this.filterDishes(dishes, nextFilters);

    this.setState({
      filters: nextFilters,
      filtered,
    });
  }

  handleSearchFilterChange(event) {
    const { dishes } = this.props;
    const nextFilters = {
      ...this.state.filters,
      search: event.target.value,
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

  checkDishAltName(dish, searchWord) {
    return dish.altName && dish.altName.toLowerCase().includes(searchWord.toLowerCase());
  }

  filterBySearchWord(dishes, searchWord) {
    const filteredDishes = {};
    Object.keys(dishes).forEach((key) => {
      if (this.checkDishAltName(dishes[key], searchWord)
        || dishes[key].name.toLowerCase().includes(searchWord.toLowerCase())) {
        filteredDishes[key] = dishes[key];
      }
    });
    return filteredDishes;
  }

  renderCateringSelect() {
    const { caterings } = this.props;
    const { filters } = this.state;
    return (
      <SelectField
        className='DishOverview-filter'
        value={ filters.catering }
        onChange={ this.handleCateringFilterChange }
      >
        <MenuItem key={ 0 } value='all' primaryText='All' />
        {
          Object.keys(caterings).map((key, index) => {
            return <MenuItem key={ index + 1 } value={ key } primaryText={ caterings[key].name } />;
          })
        }
      </SelectField>
    );
  }

  renderCategorySelect() {
    const { categories, type } = this.props;
    const { filters } = this.state;
    const standardOptionVisible = type === dishOverviewTypes.EDITABLE;
    return (
      <SelectField
        value={ filters.category }
        onChange={ this.handleCategoryFilterChange }
        className='DishOverview-filter'
      >
        <MenuItem key={ 0 } value='all' primaryText='All' />
        { standardOptionVisible &&
          <MenuItem key={ 1 } value='standard' primaryText='Standardni meni' />
        }
        {
          Object.keys(categories).map((key, index) => {
            return (
              <MenuItem
                key={ index + 2 }
                value={ key }
                primaryText={ categories[key].name }
              />
            );
          })
        }
      </SelectField>
    );
  }

  renderFilters() {
    const { search } = this.state.filters;
    return (
      <div className='DishOverview-filterWrapper'>
        <TextField
          hintText='Search'
          value={ search }
          onChange={ this.handleSearchFilterChange }
          className='DishOverview-filter'
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

  renderTableHeader(type) {
    if (type === dishOverviewTypes.SELECTABLE) {
      return (
        <TableHeader
          adjustForCheckbox={ true }
          displaySelectAll={ false }
        >
          <TableRow>
            <TableHeaderColumn>Name</TableHeaderColumn>
            <TableHeaderColumn>Description</TableHeaderColumn>
            <TableHeaderColumn>Price</TableHeaderColumn>
          </TableRow>
        </TableHeader>
      );
    } else if (type === dishOverviewTypes.REMOVABLE) {
      return (
        <TableHeader
          adjustForCheckbox={ false }
          displaySelectAll={ false }
        >
          <TableRow>
            <TableHeaderColumn>Name</TableHeaderColumn>
            <TableHeaderColumn>Description</TableHeaderColumn>
            <TableHeaderColumn>Price</TableHeaderColumn>
            <TableHeaderColumn />
          </TableRow>
        </TableHeader>
      );
    }
    return (
      <TableHeader
        adjustForCheckbox={ false }
        displaySelectAll={ false }
      >
        <TableRow>
          <TableHeaderColumn className='TableCell-name'>Name</TableHeaderColumn>
          <TableHeaderColumn className='TableCell-desc'>Description</TableHeaderColumn>
          <TableHeaderColumn>Price</TableHeaderColumn>
          <TableHeaderColumn />
          <TableHeaderColumn />
        </TableRow>
      </TableHeader>
    );
  }

  renderTableFooter(type) {
    if (type === dishOverviewTypes.SELECTABLE) {
      return (
        <TableFooter
          adjustForCheckbox={ true }
        >
          <TableRow className='DishOverview-footer' style={ { color: 'rgb(158, 158, 158)' } }>
            <TableRowColumn>Name</TableRowColumn>
            <TableRowColumn>Description</TableRowColumn>
            <TableRowColumn>Price</TableRowColumn>
          </TableRow>
        </TableFooter>
      );
    } else if (type === dishOverviewTypes.REMOVABLE) {
      return (
        <TableFooter
          adjustForCheckbox={ false }
        >
          <TableRow className='DishOverview-footer' style={ { color: 'rgb(158, 158, 158)' } }>
            <TableRowColumn>Name</TableRowColumn>
            <TableRowColumn>Description</TableRowColumn>
            <TableRowColumn>Price</TableRowColumn>
            <TableRowColumn />
          </TableRow>
        </TableFooter>
      );
    }
    return (
      <TableFooter
        adjustForCheckbox={ false }
      >
        <TableRow className='DishOverview-footer' style={ { color: 'rgb(158, 158, 158)' } }>
          <TableRowColumn className='TableCell-name'>Name</TableRowColumn>
          <TableRowColumn className='TableCell-desc'>Description</TableRowColumn>
          <TableRowColumn>Price</TableRowColumn>
          <TableRowColumn />
          <TableRowColumn />
        </TableRow>
      </TableFooter>
    );
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

  render() {
    const { type, dishes } = this.props;
    const loading = type !== dishOverviewTypes.REMOVABLE && Object.keys(dishes).length === 0;

    return (
      <div className='DishOverview'>
        <div className='DishOverview-header'>
          { this.renderFilters() }
        </div>
        { loading &&
          <div className='Dishes-loading'>
            <CircularProgress size={ 80 } thickness={ 3 } />
          </div>
        }
        { !loading &&
          <Table
            fixedHeader={ true }
            fixedFooter={ true }
            selectable={ type === dishOverviewTypes.SELECTABLE }
            multiSelectable={ type === dishOverviewTypes.SELECTABLE }
          >
            { this.renderTableHeader(type) }
            <TableBody
              displayRowCheckbox={ true }
              adjustForCheckbox={ false }
              showRowHover={ true }
            >
              { this.renderDishes() }
            </TableBody>
            { this.renderTableFooter(type) }
          </Table>
        }
      </div>
    );
  }
}
