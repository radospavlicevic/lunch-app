import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { saveCategory, updateCategory } from 'api/meals.js';

@connect(state => ({
  categoryForUpdate: state.meals.get('categoryForUpdate'),
}))
export default class CategoryForm extends Component {

  static propTypes = {
    categoryForUpdate: PropTypes.object,
  }

  constructor() {
    super();

    this.initState();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.categoryForUpdate) {
      this.initStateForUpdate(nextProps.categoryForUpdate);
    }
  }

  initState() {
    this.state = {
      name: '',
      errors: '',
      update: false,
    };
  }

  initStateForUpdate(categoryForUpdate) {
    this.setState({
      name: categoryForUpdate.name,
      errors: '',
      update: true,
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { categoryForUpdate } = this.props;
    const { name, update } = this.state;
    this.setState({
      errors: name ? '' : 'Category Name field is required. ',
    });
    if (name) {
      if (update) {
        updateCategory(categoryForUpdate.key, name);
      } else {
        saveCategory(name);
      }
      this.reset();
    }
  }

  handleNameChange(event) {
    event.preventDefault();
    this.setState({
      name: event.target.value,
    });
  }

  reset() {
    this.setState({
      name: '',
      errors: '',
      update: false,
    });
  }

  render() {
    const { errors, update, name } = this.state;
    return (
      <div className='CategoryForm'>
        <h1>Add Category</h1>
        <form className='AdminForm' onSubmit={ this.handleSubmit }>
          <div className='AdminForm-item'>
            <input
              value={ name }
              onChange={ this.handleNameChange }
              placeholder='Category Name'
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
