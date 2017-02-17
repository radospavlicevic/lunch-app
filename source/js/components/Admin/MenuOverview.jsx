import React, { Component, PropTypes } from 'react';
import DatePicker from 'react-datepicker';
import { connect } from 'react-redux';
import { db } from 'utils/firebase_config';
import { dishOverviewTypes } from 'utils/globals';
import DishOverview from 'components/Admin/DishOverview';
import { addDishInMenu, removeDishFromMenu } from 'actions/menus';

@connect(state => ({
  menus: state.menus.get('menus'),
}))
export default class MenuOverview extends Component {

  static propTypes = {
    caterings: PropTypes.object,
    categories: PropTypes.object,
    dishes: PropTypes.object,
    dispatch: PropTypes.func,
  }

  // constructor() {
  //   super();
  //
  // }

  render() {
    const { caterings, categories, dishes } = this.props;
    return (
      <div className='MenuOverview'>
        <h2>Menu Overview</h2>
        <div className='MenuOverview-item'>
          <span>Choose lunch day: </span>
          <DatePicker />
          <button className='Menus-button'>Delete Menu</button>
        </div>
        <DishOverview
          // type={ dishOverviewTypes.REMOVABLE }
          caterings={ caterings }
          categories={ categories }
          dishes={ dishes }
        />
      </div>
    );
  }
}
