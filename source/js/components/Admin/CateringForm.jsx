import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { saveCatering, updateCatering } from 'api/meals.js';

@connect(state => ({
  cateringForUpdate: state.meals.get('cateringForUpdate'),
}))

export default class CateringForm extends Component {

  static propTypes = {
    cateringForUpdate: PropTypes.object,
  }

  constructor() {
    super();

    this.state = {
      name: '',
      contact: '',
      errors: '',
      update: false,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleContactChange = this.handleContactChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.cateringForUpdate) {
      this.initStateForUpdate(nextProps.cateringForUpdate);
    }
  }

  initStateForUpdate(cateringForUpdate) {
    this.setState({
      name: cateringForUpdate.name,
      contact: cateringForUpdate.contact,
      errors: '',
      update: true,
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { cateringForUpdate } = this.props;
    const { name, contact, update } = this.state;
    this.setState({
      errors: name ? '' : 'Catering Name field is required. ',
    });
    if (name || contact) {
      if (update) {
        updateCatering(cateringForUpdate.key, name, contact);
      } else {
        saveCatering(name, contact);
      }
      this.resetInputs();
    }
  }

  handleNameChange(event) {
    event.preventDefault();
    this.setState({
      name: event.target.value,
    });
  }

  handleContactChange(event) {
    event.preventDefault();
    this.setState({
      contact: event.target.value,
    });
  }

  resetInputs() {
    this.setState({
      errors: '',
      update: false,
      name: '',
      contact: '',
    });
  }

  render() {
    const { errors, update, name, contact } = this.state;
    return (
      <div className='CateringForm'>
        <h1>Add Catering</h1>
        <form className='AdminForm' onSubmit={ this.handleSubmit }>
          <div className='AdminForm-item'>
            <input
              value={ name }
              onChange={ this.handleNameChange }
              placeholder='Catering Name'
              className={ errors ? 'AdminForm-input AdminForm-input--error' : 'AdminForm-input' }
            />
          </div>
          <div className='AdminForm-item'>
            <input
              value={ contact }
              onChange={ this.handleContactChange }
              placeholder='Catering Contact'
              className={ errors ? 'AdminForm-input AdminForm-input--error' : 'AdminForm-input' }
            />
          </div>
          <button className='AdminForm-button'>{ update ? 'Update' : 'Add' }</button>
        </form>
        { errors && <div className='Message--error'>{ errors }</div> }
      </div>
    );
  }
}
