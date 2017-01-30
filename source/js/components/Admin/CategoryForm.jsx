import React, { Component } from 'react';
import { addCategory } from 'api/meals.js';

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
      errors: categoryName ? '' : 'Category name is required. ',
    });
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
