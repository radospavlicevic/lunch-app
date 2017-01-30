
import React, { Component, PropTypes } from 'react';

export default class CategoryItem extends Component {
  static propTypes = {
    category: PropTypes.object,
  }

  constructor() {
    super();
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
  }

  handleDeleteClick() {
  }

  render() {
    const { category } = this.props;
    return (
      <tr>
        <td>{ category.name }</td>
        {/* <td><button className='AdminTable-button'>Edit</button></td> */}
        <td><button onClick={ this.handleDeleteClick } className='AdminTable-button'>Delete</button></td>
      </tr>
    );
  }
}
