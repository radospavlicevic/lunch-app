
import React, { Component, PropTypes } from 'react';
import { removeCategory } from 'api/meals';

export default class CategoryItem extends Component {
  static propTypes = {
    category: PropTypes.object,
  }

  constructor() {
    super();
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
  }

  handleDeleteClick() {
    const { category } = this.props;
    removeCategory(category.key);
  }

  render() {
    const { category } = this.props;
    return (
      <tr>
        <td>{ category.name }</td>
        <td><button onClick={ this.handleDeleteClick } className='AdminTable-button'>Delete</button></td>
      </tr>
    );
  }
}
