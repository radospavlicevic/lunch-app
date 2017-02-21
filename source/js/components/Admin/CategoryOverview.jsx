
import React, { Component, PropTypes } from 'react';
import CategoryItem from './CategoryItem';

export default class CategoryOverview extends Component {
  static propTypes = {
    categories: PropTypes.object,
    number: PropTypes.number,
  }

  renderCategories() {
    const { categories, number } = this.props;
    return categories && Object.keys(categories).map((key) => {
      const data = {
        'key': key,
        'name': categories[key].name,
      };
      return <CategoryItem key={ key } category={ data } number={ number } />;
    });
  }

  render() {
    return (
      <div className='CategoryOverview'>
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
