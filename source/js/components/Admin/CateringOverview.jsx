
import React, { Component, PropTypes } from 'react';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow } from 'material-ui/Table';
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
      <div className='CateringOverview'>
        <Table
          selectable={ false }
        >
          <TableHeader
            adjustForCheckbox={ false }
            displaySelectAll={ false }
          >
            <TableRow>
              <TableHeaderColumn>Catering Name</TableHeaderColumn>
              <TableHeaderColumn>Catering Contact</TableHeaderColumn>
              <TableHeaderColumn className='u-tableCellButton' />
              <TableHeaderColumn className='u-tableCellButton' />
            </TableRow>
          </TableHeader>
          <TableBody
            displayRowCheckbox={ false }
          >
            { this.renderCaterings() }
          </TableBody>
        </Table>
      </div>
    );
  }
}
