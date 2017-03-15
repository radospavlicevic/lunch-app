import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { saveCatering, updateCatering } from 'api/meals';
import { cancelCateringUpdate } from 'actions/meals';

@connect(state => ({
  cateringForUpdate: state.meals.get('cateringForUpdate'),
}))

export default class CateringForm extends Component {

  static propTypes = {
    cateringForUpdate: PropTypes.object,
    dispatch: PropTypes.func,
  }

  constructor() {
    super();

    this.initState();

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleContactChange = this.handleContactChange.bind(this);
    this.handleCancelClick = this.handleCancelClick.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.cateringForUpdate) {
      this.initStateForUpdate(nextProps.cateringForUpdate);
    } else {
      this.initState();
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

  initState() {
    this.state = {
      name: '',
      contact: '',
      errors: '',
      update: false,
    };
  }

  handleSubmit(event) {
    event.preventDefault();
    const { cateringForUpdate } = this.props;
    const { name, contact, update } = this.state;
    this.setState({
      errors: name ? '' : 'Catering Name field is required. ',
    });
    if (name) {
      if (update) {
        updateCatering(cateringForUpdate.key, name, contact);
      } else {
        saveCatering(name, contact);
      }
      this.resetInputs();
    }
  }

  handleNameChange(event, value) {
    event.preventDefault();
    this.setState({
      name: value,
    });
  }

  handleContactChange(event, value) {
    event.preventDefault();
    this.setState({
      contact: value,
    });
  }

  handleCancelClick() {
    const { dispatch } = this.props;
    dispatch(cancelCateringUpdate());
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
        <div className='AdminForm-wrapper'>
          <form className='AdminForm' onSubmit={ this.handleSubmit }>
            <h2>Caterings</h2>
            <TextField
              value={ name }
              hintText='Catering Name Field'
              floatingLabelText='Catering Name'
              fullWidth={ true }
              onChange={ this.handleNameChange }
              errorText={ errors }
            />
            <TextField
              value={ contact }
              hintText='Catering Contact Field'
              floatingLabelText='Catering Contact'
              fullWidth={ true }
              onChange={ this.handleContactChange }
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
