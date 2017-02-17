import React, { Component } from 'react';
import { saveCategory } from 'api/meals.js';

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
    const categoryName = this.categoryNameInput.value;
    this.setState({
      errors: categoryName ? '' : 'Category Name field is required. ',
    });
    if (categoryName) {
      saveCategory(categoryName);
      this.resetInput();
    }
  }

  resetInput() {
    this.categoryNameInput.value = '';
  }

  render() {
    const { errors } = this.state;
    return (
      <div className='CategoryForm'>
        <h1>Add Category</h1>
        <form className='AdminForm' onSubmit={ this.handleSubmit }>
          <div className='AdminForm-item'>
            <input
              ref={ input => this.categoryNameInput = input }
              placeholder='Category Name'
              className={ errors ? 'AdminForm-input AdminForm-input--error' : 'AdminForm-input' }
            />
          </div>
          <button className='AdminForm-button'>Add</button>
        </form>
        { errors && <div className='Message--error'>{ errors }</div> }
      </div>
    );
  }
}
