
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { saveDishInMenu, daleteDishFromMenu } from 'api/menus';

@connect()
export default class SelectableDishItem extends Component {
  static propTypes = {
    dishKey: PropTypes.string,
    dishData: PropTypes.object,
    menus: PropTypes.object,
    lunchDay: PropTypes.string,
  }

  constructor() {
    super();

    this.handleClick = this.handleClick.bind(this);
  }

  componentWillMount() {
    const { menus, lunchDay } = this.props;
    this.checkSelect(menus, lunchDay, true);
  }

  componentWillReceiveProps(nextProps) {
    this.checkSelect(nextProps.menus, nextProps.lunchDay, false);
  }

  checkSelect(menus, lunchDay, init) {
    const { dishKey } = this.props;
    const selected = menus[lunchDay] && menus[lunchDay][dishKey] !== undefined;
    if (init) {
      this.state = {
        'selected': selected,
      };
    } else {
      this.setState({
        'selected': selected,
      });
    }
  }

  handleClick(event) {
    event.preventDefault();
    const { dishKey, dishData, lunchDay } = this.props;
    const { selected } = this.state;
    if (!selected) saveDishInMenu(lunchDay, { key: dishKey, data: dishData });
    else daleteDishFromMenu(lunchDay, dishKey);
  }

  render() {
    const { dishData } = this.props;
    const { selected } = this.state;
    return (
      <button
        className={ selected ? 'DishItem--selectable DishItem--selected' : 'DishItem--selectable' }
        onClick={ this.handleClick }
      >
        <h2>{ dishData.name }</h2>
        { dishData.description && <div className='DishItem-desc' >{ dishData.description }</div> }
        <hr />
        <div className='DishItem-footer'>
          <div className='DishItem-price'>{ dishData.price }din</div>
          { selected && <div className='DishItem-checkMark' /> }
        </div>
      </button>
    );
  }
}
