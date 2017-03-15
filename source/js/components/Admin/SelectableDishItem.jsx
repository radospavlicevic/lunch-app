
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { TableRow, TableRowColumn } from 'material-ui/Table';
import Checkbox from 'material-ui/Checkbox';
import { saveDishInMenu, deleteDishFromMenu } from 'api/menus';

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
    const selected = menus && menus[lunchDay] && menus[lunchDay][dishKey];
    if (init) {
      this.state = {
        selected,
      };
    } else {
      this.setState({
        selected,
      });
    }
  }

  handleClick(event) {
    event.preventDefault();
    const { dishKey, dishData, lunchDay } = this.props;
    const { selected } = this.state;
    if (!selected) saveDishInMenu(lunchDay, { key: dishKey, data: dishData });
    else deleteDishFromMenu(lunchDay, dishKey);
  }

  render() {
    const { dishData } = this.props;
    const selected = this.state.selected ? true : false; // eslint-disable-line
    return (
      <TableRow
        className='DishItem'
        selected={ selected }
        onRowClick={ this.handleClick }
      >
        <TableRowColumn className='u-tableCellCheckIcon'>
          <Checkbox checked={ selected } />
        </TableRowColumn>
        <TableRowColumn>{ dishData.name }</TableRowColumn>
        <TableRowColumn>{ dishData.description }</TableRowColumn>
        <TableRowColumn>{ dishData.price ? dishData.price : 0 } din</TableRowColumn>
      </TableRow>
    );
  }
}
