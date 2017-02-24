import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { saveDish, updateDish } from 'api/meals';

@connect(state => ({
  dishForUpdate: state.meals.get('dishForUpdate'),
}))
export default class DishForm extends Component {

  static propTypes = {
    caterings: PropTypes.object,
    categories: PropTypes.object,
    dishForUpdate: PropTypes.object,
  }

  constructor() {
    super();

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCategoryChange = this.handleCategoryChange.bind(this);
    this.handleStandardChange = this.handleStandardChange.bind(this);
  }

  componentWillMount() {
    this.initState();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.dishForUpdate) {
      this.initStateForUpdate(nextProps.dishForUpdate);
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

  handleChange(event, propertyName) {
    event.preventDefault();
    this.setState({
      dish: {
        ...this.state.dish,
        [propertyName]: event.target.value,
      },
    });
  }

  handleCategoryChange(event) {
    event.preventDefault();
    const nextCategory = event.target.value;
    const nextStandard = nextCategory === 'main_dish' ? this.state.dish.standard : false;
    this.setState({
      dish: {
        ...this.state.dish,
        category: nextCategory,
        standard: nextStandard,
      },
    });
  }

  handleStandardChange() {
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

  validationPassed() {
    let passed = true;
    const { categories } = this.props;
    const { name, price, category } = this.state.dish;
    const errors = {
      name: '',
      price: '',
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
      'errors': errors,
    });
    return passed;
  }

  renderCateringSelect() {
    const { caterings } = this.props;
    const { dish } = this.state;
    return (
      <select className='AdminForm-select' value={ dish.catering } onChange={ (e) => this.handleChange(e, 'catering') }>
        {
          Object.keys(caterings).map((key, index) => {
            return <option key={ index } value={ key }>{ caterings[key].name }</option>;
          })
        }
      </select>
    );
  }

  renderCategorySelect() {
    const { categories } = this.props;
    const { dish } = this.state;
    return (
      <select className='AdminForm-select' value={ dish.category } onChange={ this.handleCategoryChange }>
        {
          Object.keys(categories).map((key, index) => {
            return <option key={ index } value={ key }>{ categories[key].name }</option>;
          })
        }
      </select>
    );
  }

  render() {
    const { errors, update, dish } = this.state;
    return (
      <div className='DishForm'>
        <h1>Add Dish</h1>
        <form className='AdminForm' onSubmit={ this.handleSubmit }>
          <div className='AdminForm-item'>
            { this.renderCateringSelect() }
          </div>
          <div className='AdminForm-item'>
            { this.renderCategorySelect() }
          </div>
          <div className='AdminForm-item'>
            <input
              id='standard-checkbox'
              type='checkbox'
              disabled={ dish.category !== 'main_dish' }
              checked={ dish.standard }
              onChange={ this.handleStandardChange }
            />
            <label className='AdminForm-item-checkboxText' htmlFor='standard-checkbox'>
              Standard
            </label>
          </div>
          <div className='AdminForm-item'>
            <input
              onChange={ (e) => this.handleChange(e, 'name') }
              value={ dish.name }
              placeholder='Name'
              className={ errors.name ? 'AdminForm-input AdminForm-input--error' : 'AdminForm-input' }
            />
          </div>
          <div className='AdminForm-item'>
            <textarea
              onChange={ (e) => this.handleChange(e, 'description') }
              value={ dish.description }
              placeholder='Description'
              className='AdminForm-textarea'
            />
          </div>
          <div className='AdminForm-item'>
            <input
              onChange={ (e) => this.handleChange(e, 'price') }
              value={ dish.price }
              placeholder='Price'
              className={ errors.price ? 'AdminForm-input AdminForm-input--error' : 'AdminForm-input' }
            />
          </div>
          <button className='AdminForm-button'>{ update ? 'Update Dish' : 'Add Dish' }</button>
        </form>
        { errors.name && <div className='Message--error'>{ errors.name }</div> }
        { errors.price && <div className='Message--error'>{ errors.price }</div> }
      </div>
    );
  }
}
