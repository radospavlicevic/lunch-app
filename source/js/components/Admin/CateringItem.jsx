
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { removeCatering } from 'api/meals';
import { prepareCateringUpdate } from 'actions/meals';

@connect()
export default class CateringItem extends Component {
  static propTypes = {
    catering: PropTypes.object,
    number: PropTypes.number,
    dispatch: PropTypes.func,
  }

  constructor() {
    super();

    this.handleDeleteClick = this.handleDeleteClick.bind(this);
    this.handleEditClick = this.handleEditClick.bind(this);
  }

  handleDeleteClick() {
    const { catering, number } = this.props;
    if (number > 1) {
      removeCatering(catering.key);
    }
  }

  handleEditClick() {
    const { catering, dispatch } = this.props;

    dispatch(prepareCateringUpdate(
      catering.key, { name: catering.name, contact: catering.contact }
    ));
  }


  render() {
    const { catering } = this.props;
    return (
      <tr>
        <td>{ catering.name }</td>
        <td>{ catering.contact }</td>
        <td><button onClick={ this.handleEditClick } className='AdminTable-button'>Edit</button></td>
        <td><button onClick={ this.handleDeleteClick } className='AdminTable-button'>Delete</button></td>
      </tr>
    );
  }
}
