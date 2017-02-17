
import React, { Component, PropTypes } from 'react';
import { Modal } from 'components/global/Modal';
import { removeCatering } from 'api/meals';

export default class CategoryItem extends Component {
  static propTypes = {
    catering: PropTypes.object,
    number: PropTypes.number,
  }

  constructor() {
    super();

    this.handleDeleteClick = this.handleDeleteClick.bind(this);
  }

  handleDeleteClick() {
    const { catering, number } = this.props;
    if (number > 1) {
      removeCatering(catering.key);
    }
  }

  render() {
    const { catering } = this.props;
    return (
      <tr>
        <td>{ catering.name }</td>
        <td>{ catering.contact }</td>
        <td><button onClick={ this.handleDeleteClick } className='AdminTable-button'>Delete</button></td>
      </tr>
    );
  }
}
