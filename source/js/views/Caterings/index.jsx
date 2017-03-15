import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { removeDish } from 'api/meals.js';
import { addOrUpdateCatering, deleteCatering, countCaterings } from 'actions/meals.js';
import { db } from 'utils/firebase_config';
import AdminMenu from 'components/Admin/AdminMenu';
import CateringForm from 'components/Admin/CateringForm';
import CateringOverview from 'components/Admin/CateringOverview';
import CheckAdminRole from '../../decorators/AuthorizationDecorator';

@CheckAdminRole
@connect(state => ({
  caterings: state.meals.get('caterings'),
  cateringsNumber: state.meals.get('cateringsNumber'),
  dishes: state.meals.get('dishes'),
}))
export default class Caterings extends Component {

  static propTypes = {
    caterings: PropTypes.object,
    cateringsNumber: PropTypes.number,
    dishes: PropTypes.object,
    dispatch: PropTypes.func,
  }

  componentWillMount() {
    this.setupFirebaseObservers();
    document.title = 'Caterings, Admin - Yummy Yumzor';
  }

  setupFirebaseObservers() {
    const { dispatch } = this.props;
    db.ref('caterings').on('value', snapshot => {
      dispatch(countCaterings(snapshot.numChildren()));
    });

    db.ref('caterings').on('child_added', newCatering => {
      dispatch(addOrUpdateCatering(newCatering.key, newCatering.val()));
    });

    db.ref('caterings').on('child_changed', newCatering => {
      dispatch(addOrUpdateCatering(newCatering.key, newCatering.val()));
    });

    db.ref('caterings').on('child_removed', removedCatering => {
      dispatch(deleteCatering(removedCatering.key));
      this.cascadeDelete(removedCatering.key);
    });
  }

  cascadeDelete(cateringKey) {
    const { dishes } = this.props;
    Object.keys(dishes).forEach(key => {
      if (dishes[key].catering === cateringKey) {
        removeDish(key);
      }
    });
  }

  render() {
    const { caterings, cateringsNumber } = this.props;
    return (
      <div className='Admin-wrapper'>
        <AdminMenu />
        <div className='Caterings'>
          <CateringForm />
          <CateringOverview caterings={ caterings } number={ cateringsNumber } />
        </div>
      </div>
    );
  }
}
