import React, { Component, PropTypes } from 'react';
// import { connect } from 'react-redux';
import { userSignedIn } from 'api/auth';
import { saveNoteInOrder, deleteUserOrder } from 'api/orders';
import MenuSection from 'components/Client/MenuSection';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';

// @connect()
export default class Order extends Component {
  static propTypes = {
    categories: PropTypes.object,
    menus: PropTypes.object,
    selectedDate: PropTypes.string,
    standardDishes: PropTypes.object,
    orders: PropTypes.object,
    // dispatch: PropTypes.func,
  }

  constructor() {
    super();

    this.handleNoteChange = this.handleNoteChange.bind(this);
    this.handleCancelLunchClick = this.handleCancelLunchClick.bind(this);
  }

  componentWillMount() {
    const { orders, selectedDate } = this.props;
    this.state = {
      note: this.getNote(orders, selectedDate, userSignedIn().uid),
      open: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { orders, selectedDate } = this.props;
    if (nextProps.orders !== orders) {
      this.setState({
        note: this.getNote(orders, selectedDate, userSignedIn().uid),
      });
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timeoutID);
    this.timeoutID = null;
  }

  getNote(orders, date, uid) {
    if (!orders) return '';
    if (!orders[date]) return '';
    if (!orders[date][uid]) return '';
    return orders[date][uid].note;
  }

  getOrder(loggedInUser, selectedDate, orders) {
    const mealItems = [];
    const { menus, categories, standardDishes } = this.props;
    if (loggedInUser && orders[selectedDate] && orders[selectedDate][userSignedIn().uid]) {
      const { meal, note } = orders[selectedDate][userSignedIn().uid];
      Object.keys(meal).forEach(key => {
        if (menus[selectedDate][meal[key]] || standardDishes[meal[key]]) {
          const dish = menus[selectedDate][meal[key]] || standardDishes[meal[key]];
          mealItems.push({
            category: categories[key].name,
            dish,
          });
        }
      });
      return {
        mealItems,
        note,
      };
    }
    return null;
  }

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleNoteChange(event, value) {
    clearTimeout(this.timeoutID);
    this.timeoutID = setTimeout(() => {
      const { selectedDate } = this.props;
      saveNoteInOrder(selectedDate, value);
    }, 800);
    this.setState({
      note: value,
    });
  }

  handleCancelLunchClick() {
    const { selectedDate } = this.props;
    deleteUserOrder(selectedDate, userSignedIn().uid);
  }

  filterByCategory(dishes, category) {
    const { standardDishes } = this.props;
    if (!dishes) {
      return (category === 'main_dish') ? standardDishes : null;
    }
    const filteredDishes = {};

    Object.keys(dishes).forEach((key) => {
      if (dishes[key].category === category) {
        filteredDishes[key] = dishes[key];
      }
    });

    return (category !== 'main_dish') ? filteredDishes : Object.assign({}, filteredDishes, standardDishes);
  }

  menuIsLocked(selectedDate) {
    const { menus } = this.props;
    return menus[selectedDate] && menus[selectedDate].locked;
  }

  emptyMenu(selectedDate) {
    const { menus } = this.props;
    if (menus[selectedDate]) {
      return (Object.keys(menus[selectedDate]).length === 0) ||
              (Object.keys(menus[selectedDate]).length === 1 &&
              menus[selectedDate].locked !== undefined);
    }
    return false;
  }

  renderMenuSections(selectedDate) {
    const { menus, categories, orders } = this.props;
    return Object.keys(categories).map((key, index) => {
      return (
        <MenuSection
          key={ index }
          dishes={ this.filterByCategory(menus[selectedDate], key) }
          category={
            { key, name: categories[key].name }
          }
          selectedDate={ selectedDate }
          orders={ orders }
        />
      );
    });
  }

  renderLockedScreen(selectedDate) {
    return (
      <div className='Order-locked'>
        <span>Lunch ordering for { selectedDate } is locked.</span>
      </div>
    );
  }

  renderNoMenuScreen() {
    return (
      <div className='Order-locked'>
        <span>There is no menu for this day yet.</span>
      </div>
    );
  }

  renderUnlockedScreen(selectedDate) {
    const actions = [
      <RaisedButton
        label='Back'
        primary={ true }
        onTouchTap={ this.handleClose }
      />,
      <RaisedButton
        secondary={ true }
        onClick={ this.handleCancelLunchClick }
        className='Order-cancelLunchButton'
        label={ 'Cancel Lunch' }
        onTouchTap={ this.handleClose }
      />,
    ];
    return (
      <div className='Order-wrapper'>
        { this.renderMenuSections(selectedDate) }
        <div className='Order-noteSection'>
          <TextField
            style={ { maxWidth: 500, width: '100%' } }
            floatingLabelText='Note'
            multiLine={ true }
            className='Order-note'
            value={ this.state.note }
            onChange={ this.handleNoteChange }
          />
        </div>
        <div className='Order-cancelLunch'>
          <RaisedButton label={ 'Cancel lunch' } onTouchTap={ this.handleOpen } secondary={ true } style={ { maxWidth: 500 } } />
          <Dialog
            actions={ actions }
            modal={ false }
            open={ this.state.open }
            onRequestClose={ this.handleClose }
          ><p className='Order-cancelLunchQuestion'>Are you sure you want to cancel your lunch?</p>
          </Dialog>
        </div>
      </div>
    );
  }

  renderMyOrderSide(selectedDate) {
    const { menus } = this.props;
    if (!menus[selectedDate] || this.emptyMenu(selectedDate)) {
      return this.renderNoMenuScreen(selectedDate);
    } else if (this.menuIsLocked(selectedDate)) {
      return this.renderLockedScreen(selectedDate);
    }
    return this.renderUnlockedScreen(selectedDate);
  }

  render() {
    const { selectedDate } = this.props;
    return (
      <div className='Order'>
        { this.renderMyOrderSide(selectedDate) }
      </div>
    );
  }
}
