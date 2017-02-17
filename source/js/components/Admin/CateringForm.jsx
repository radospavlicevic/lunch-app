import React, { Component } from 'react';
import { saveCatering } from 'api/meals.js';

export default class CategoryForm extends Component {

  constructor() {
    super();
    this.state = {
      errors: '',
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    const cateringName = this.cateringNameInput.value;
    const cateringContact = this.categoryContactInput.value;
    this.setState({
      errors: cateringName ? '' : 'Catering Name field is required. ',
    });
    if (cateringName) {
      saveCatering({
        name: cateringName,
        contact: cateringContact,
      });
      this.resetInputs();
    }
  }

  resetInputs() {
    this.cateringNameInput.value = '';
    this.categoryContactInput.value = '';
  }

  render() {
    const { errors } = this.state;
    return (
      <div className='CateringForm'>
        <h1>Add Catering</h1>
        <form className='AdminForm' onSubmit={ this.handleSubmit }>
          <div className='AdminForm-item'>
            <input
              ref={ input => this.cateringNameInput = input }
              placeholder='Catering Name'
              className={ errors ? 'AdminForm-input AdminForm-input--error' : 'AdminForm-input' }
            />
          </div>
          <div className='AdminForm-item'>
            <input
              ref={ input => this.categoryContactInput = input }
              placeholder='Catering Contact'
              className='AdminForm-input'
            />
          </div>
          <button className='AdminForm-button'>Add</button>
        </form>
        { errors && <div className='Message--error'>{ errors }</div> }
      </div>
    );
  }
}
