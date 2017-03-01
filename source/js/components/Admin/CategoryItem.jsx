
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { prepareCategoryUpdate } from 'actions/meals';
import { removeCategory } from 'api/meals';

@connect()
export default class CategoryItem extends Component {
  static propTypes = {
    category: PropTypes.object,
    dispatch: PropTypes.func,
  }

  constructor() {
    super();

    this.handleDeleteClick = this.handleDeleteClick.bind(this);
    this.handleEditClick = this.handleEditClick.bind(this);
  }

  handleDeleteClick() {
    const { category } = this.props;
    removeCategory(category.key);
  }

  handleEditClick() {
    const { category, dispatch } = this.props;
    dispatch(prepareCategoryUpdate(category.key, category.name));
  }

  render() {
    const { category } = this.props;
    return (
      <tr>
        <td>{ category.name }</td>
        <td><button onClick={ this.handleEditClick } disabled={ category.key === 'main_dish' } className='AdminTable-button'>Edit</button></td>
        <td><button onClick={ this.handleDeleteClick } disabled={ category.key === 'main_dish' } className='AdminTable-button'>Delete</button></td>
      </tr>
    );
  }
}
