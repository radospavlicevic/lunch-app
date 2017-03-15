import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import { saveDish, updateDish } from 'api/meals';
import { cancelDishUpdate } from 'actions/meals';

@connect(state => ({
  dishForUpdate: state.meals.get('dishForUpdate'),
}))
export default class DishForm extends Component {

  static propTypes = {
    caterings: PropTypes.object,
    categories: PropTypes.object,
    dishForUpdate: PropTypes.object,
    dispatch: PropTypes.func,
  }

  constructor() {
    super();

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCategoryChange = this.handleCategoryChange.bind(this);
    this.handleCateringChange = this.handleCateringChange.bind(this);
    this.handleStandardCheck = this.handleStandardCheck.bind(this);
    this.handleCancelClick = this.handleCancelClick.bind(this);
  }

  componentWillMount() {
    this.initState();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.dishForUpdate) {
      this.initStateForUpdate(nextProps.dishForUpdate);
    } else {
      this.initState();
    }
  }

  initStateForUpdate(dishForUpdate) {
    this.setState({
      dish: {
        name: dishForUpdate.data.name,
        description: dishForUpdate.data.description,
        catering: dishForUpdate.data.catering,
        category: dishForUpdate.data.category,
        standard: dishForUpdate.data.standard,
        price: dishForUpdate.data.price,
      },
      errors: {},
      update: true,
    });
  }

  initState() {
    const { caterings, categories } = this.props;
    this.state = {
      dish: {
        name: '',
        description: '',
        catering: Object.keys(caterings)[0],
        category: Object.keys(categories)[0],
        standard: false,
        price: '',
      },
      errors: {},
      update: false,
    };
  }

  resetState() {
    this.setState({
      dish: {
        ...this.state.dish,
        name: '',
        description: '',
        price: '',
      },
      errors: {},
      update: false,
    });
  }

  handleTextFieldChange(event, value, propertyName) {
    event.preventDefault();
    this.setState({
      dish: {
        ...this.state.dish,
        [propertyName]: event.target.value,
      },
    });
  }

  handleCategoryChange(event, index, value) {
    const nextCategory = value;
    const nextStandard = nextCategory === 'main_dish' ? this.state.dish.standard : false;
    this.setState({
      dish: {
        ...this.state.dish,
        category: nextCategory,
        standard: nextStandard,
      },
    });
  }

  handleCateringChange(event, index, value) {
    this.setState({
      dish: {
        ...this.state.dish,
        catering: value,
      },
    });
  }

  handleStandardCheck() {
    const checked = !this.state.dish.standard;
    this.setState({
      dish: {
        ...this.state.dish,
        standard: checked,
      },
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { update, dish } = this.state;
    const { dishForUpdate } = this.props;
    if (this.validationPassed()) {
      if (update) {
        updateDish(dishForUpdate.key, dish);
      } else {
        saveDish(dish);
      }
      this.resetState();
    }
  }

  handleCancelClick() {
    const { dispatch } = this.props;
    dispatch(cancelDishUpdate());
  }

  validationPassed() {
    let passed = true;
    const { categories } = this.props;
    const { name, price, category } = this.state.dish;
    const errors = {
      name: '',
    };

    if (!name) {
      errors.name = 'Name field is required. ';
      passed = false;
    }

    if (categories[category].name.toLowerCase() !== 'salate' && !price) {
      errors.price = 'Price field is required. ';
      passed = false;
    }
    this.setState({
      errors,
    });
    return passed;
  }

  renderCateringSelect() {
    const { caterings } = this.props;
    const { dish } = this.state;
    return (
      <SelectField
        floatingLabelText='Catering'
        value={ dish.catering }
        onChange={ this.handleCateringChange }
      >
        {
          Object.keys(caterings).map((key, index) => {
            return (
              <MenuItem
                key={ index }
                value={ key }
                primaryText={ caterings[key].name }
              />
            );
          })
        }
      </SelectField>
    );
  }

  renderCategorySelect() {
    const { categories } = this.props;
    const { dish } = this.state;
    return (
      <SelectField
        floatingLabelText='Category'
        value={ dish.category }
        onChange={ this.handleCategoryChange }
      >
        {
          Object.keys(categories).map((key, index) => {
            return (
              <MenuItem
                key={ index }
                value={ key }
                primaryText={ categories[key].name }
              />
            );
          })
        }
      </SelectField>
    );
  }

  render() {
    const { errors, update, dish } = this.state;
    return (
      <div className='DishForm'>
        <div className='AdminForm-wrapper'>
          <form className='AdminForm' onSubmit={ this.handleSubmit }>
            <h2>Dishes</h2>
            <div className='AdminForm-item'>
              { this.renderCateringSelect() }
              { this.renderCategorySelect() }
            </div>
            <Checkbox
              label='Standard'
              disabled={ dish.category !== 'main_dish' }
              checked={ dish.standard }
              onCheck={ this.handleStandardCheck }
            />
            <TextField
              hintText='Name Field'
              floatingLabelText='Name'
              fullWidth={ true }
              value={ dish.name }
              onChange={ (e, value) => this.handleTextFieldChange(e, value, 'name') }
              errorText={ errors.name }
            />
            <TextField
              hintText='Description Field'
              floatingLabelText='Description'
              fullWidth={ true }
              multiLine={ true }
              rows={ 3 }
              rowsMax={ 3 }
              value={ dish.description }
              onChange={ (e, value) => this.handleTextFieldChange(e, value, 'description') }
            />
            <TextField
              hintText='Price Field'
              floatingLabelText='Price'
              fullWidth={ true }
              value={ dish.price }
              onChange={ (e, value) => this.handleTextFieldChange(e, value, 'price') }
            />
            <RaisedButton
              type='submit'
              className='AdminForm-button'
              label={ update ? 'Update Dish' : 'Add Dish' }
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
