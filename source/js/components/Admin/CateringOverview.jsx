
import React, { Component, PropTypes } from 'react';
import CateringItem from './CateringItem';

export default class CateringOverview extends Component {
  static propTypes = {
    caterings: PropTypes.object,
    number: PropTypes.number,
  }

  renderCaterings() {
    const { caterings, number } = this.props;
    return caterings && Object.keys(caterings).map((key) => {
      const data = {
        'key': key,
        'name': caterings[key].name,
        'contact': caterings[key].contact,
      };
      return <CateringItem key={ key } catering={ data } number={ number } />;
    });
  }

  render() {
    return (
      <div className='CategoryOverview'>
        <h1>All Caterings</h1>
        <table className='AdminTable table'>
          <thead>
            <tr>
              <th>Catering Name</th>
              <th>Catering Contact</th>
            </tr>
          </thead>
          <tbody>
            { this.renderCaterings() }
          </tbody>
        </table>
      </div>
    );
  }
}
