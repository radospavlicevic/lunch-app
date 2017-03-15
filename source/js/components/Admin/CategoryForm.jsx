import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { saveCategory, updateCategory } from 'api/meals';
import { cancelCategoryUpdate } from 'actions/meals';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

@connect(state => ({
  categoryForUpdate: state.meals.get('categoryForUpdate'),
}))
export default class CategoryForm extends Component {

  static propTypes = {
    categoryForUpdate: PropTypes.object,
    dispatch: PropTypes.func,
  }

  constructor() {
    super();

    this.initState();

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleCancelClick = this.handleCancelClick.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.categoryForUpdate) {
      this.initStateForUpdate(nextProps.categoryForUpdate);
    } else {
      this.initState();
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

  handleCancelClick() {
    const { dispatch } = this.props;
    dispatch(cancelCategoryUpdate());
  }

  handleNameChange(event, value) {
    event.preventDefault();
    this.setState({
      name: value,
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
        <div className='AdminForm-wrapper'>
          <form className='AdminForm' onSubmit={ this.handleSubmit }>
            <h2>Categories</h2>
            <TextField
              value={ name }
              hintText='Category Name Field'
              floatingLabelText='Category Name'
              fullWidth={ true }
              onChange={ this.handleNameChange }
              errorText={ errors }
            />
            <RaisedButton
              type='submit'
              className='AdminForm-button'
              label={ update ? 'Update' : 'Add' }
              primary={ true }
            />
            {
              update &&
              <RaisedButton
                style={ { marginLeft: 10 } }
                className='AdminForm-button'
                label='Cancel'
                primary={ true }
                onClick={ this.handleCancelClick }
              />
            }
          </form>
        </div>
      </div>
    );
  }
}
