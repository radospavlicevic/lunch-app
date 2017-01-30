
import React, { Component, PropTypes } from 'react';
import CategoryItem from './CategoryItem';

export default class UserOverview extends Component {
  static propTypes = {
    categories: PropTypes.array,
  }

  renderCategories() {
    const { categories } = this.props;
    return categories && categories.map((data, index) => {
      return <CategoryItem key={ index } category={ data } />;
    });
  }

  render() {
    return (
      <div className='UserOverview'>
        <h1>All Categories</h1>
        <table className='AdminTable table'>
          <thead>
            <tr>
              <th>Category Name</th>
            </tr>
          </thead>
          <tbody>
            { this.renderCategories() }
          </tbody>
        </table>
      </div>
    );
  }
}
