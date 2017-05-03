import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { removeDish } from 'api/meals.js';
import { loadCaterings, deleteCatering, countCaterings } from 'actions/meals.js';
import AdminMenu from 'components/Admin/AdminMenu';
import CateringForm from 'components/Admin/CateringForm';
import CateringOverview from 'components/Admin/CateringOverview';
import { observableModule } from 'components/Observable/observableModule';
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
  }

  componentWillMount() {
    this.setupFirebaseObservers();
    document.title = 'Caterings, Admin - Yummy Yumzor';
  }

  setupFirebaseObservers() {
    observableModule.addValueCounterObserver('caterings', loadCaterings, countCaterings);
    observableModule.addCascadingObserver('caterings', 'child_removed', deleteCatering, this.cascadeDelete.bind(this));
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
