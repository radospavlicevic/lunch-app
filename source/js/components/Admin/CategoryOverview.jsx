
import React, { Component, PropTypes } from 'react';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow } from 'material-ui/Table';
import CategoryItem from './CategoryItem';

export default class CategoryOverview extends Component {
  static propTypes = {
    categories: PropTypes.object,
  }

  renderCategories() {
    const { categories } = this.props;
    return categories && Object.keys(categories).map((key) => {
      const data = {
        'key': key,
        'name': categories[key].name,
      };
      return <CategoryItem key={ key } category={ data } />;
    });
  }

  render() {
    return (
      <div className='CategoryOverview'>
        <Table
          selectable={ false }
        >
          <TableHeader
            adjustForCheckbox={ false }
            displaySelectAll={ false }
          >
            <TableRow>
              <TableHeaderColumn>Category Name</TableHeaderColumn>
              <TableHeaderColumn className='TableCell-button' />
              <TableHeaderColumn className='TableCell-button' />
            </TableRow>
          </TableHeader>
          <TableBody
            displayRowCheckbox={ false }
          >
            { this.renderCategories() }
          </TableBody>
        </Table>
      </div>
    );
  }
}
