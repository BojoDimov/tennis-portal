import React from 'react';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

import { l10n_text } from '../components/L10n';
import { SortableTableCell, orderData, transformToUserPlayedHours, transformByClassifier } from './utils';
import { Typography } from '@material-ui/core';

export class UserPlayedHours extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      order: null
    };

    this.handleOrder = (prop) => (direction) => {
      this.setState({ order: [prop, direction] });
    }
  }

  render() {
    const data = transformToUserPlayedHours(this.props.data);
    orderData(data, this.state.order);

    return (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell style={{ width: '50%' }}>Потребител</TableCell>
            <SortableTableCell orderHandler={this.handleOrder('totalHours')}>
              Изиграни часове
            </SortableTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map(e => {
            return (
              <TableRow key={e.customer.id}>
                <TableCell>
                  <Typography>
                    {e.customer.name}
                    <Typography variant="caption">{e.customer.email}</Typography>
                  </Typography>
                </TableCell>
                <TableCell>{e.totalHours}</TableCell>
              </TableRow>
            );
          })}
          <TableRow>
            <TableCell>ОБЩО</TableCell>
            <TableCell>{data.reduce((acc, curr) => acc + curr.totalHours, 0)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  }
}

export class StatisticByClassifier extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      order: null
    };

    this.handleOrder = (prop) => (direction) => {
      this.setState({ order: [prop, direction] });
    }
  }

  render() {
    const { data, classifier, translation, label1, label2 } = this.props;
    const transformed = transformByClassifier(data, classifier);
    orderData(transformed, this.state.order);

    return (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell style={{ width: '50%' }}>{label1}</TableCell>
            <SortableTableCell orderHandler={this.handleOrder('count')}>
              {label2}
            </SortableTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transformed.map(e => {
            return (
              <TableRow key={e.key}>
                <TableCell>{l10n_text(e.key, translation)}</TableCell>
                <TableCell>{e.count}</TableCell>
              </TableRow>
            );
          })}
          <TableRow>
            <TableCell>ОБЩО</TableCell>
            <TableCell>{transformed.reduce((acc, curr) => acc + curr.count, 0)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  }
}
