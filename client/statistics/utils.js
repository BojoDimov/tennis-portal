import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableSortLabel from '@material-ui/core/TableSortLabel';

export class SortableTableCell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
      direction: 'desc'
    };

    this.handleClick = () => {
      let { direction, active } = this.state;

      if (!active)
        active = true;
      else if (direction === 'desc')
        direction = 'asc';
      else
        direction = 'desc';


      this.setState({ direction, active });
      this.props.orderHandler(direction);
    }
  }

  render() {
    return (
      <TableCell onClick={this.handleClick}>
        <TableSortLabel
          active={this.state.active}
          direction={this.state.direction}
        >
          {this.props.children}
        </TableSortLabel>
      </TableCell>
    );
  }
}

export function orderData(data, ordering) {
  if (!ordering)
    return;

  if (ordering[1] === 'asc')
    data.sort((a, b) => b[ordering[0]] - a[ordering[0]]);
  else
    data.sort((a, b) => a[ordering[0]] - b[ordering[0]]);
}

export function transformDailyData(data, classifier) {
  const reduced = data
    .reduce((acc, curr) => acc.concat(curr.payments), []);

  const result = {};

  Object.keys(classifier).forEach(key => {
    result[classifier[key]] = 0
  });

  reduced.forEach(e => {
    result[e.type]++
  });

  return Object.keys(result).map(key => {
    return {
      key,
      count: result[key]
    }
  });
}

export function transformMonthlyData(data, classifier) {
  const users = {};

  data.forEach(e => {
    if (!users[e.customerId]) {
      users[e.customerId] = {
        customer: e.customer,
        payments: {}
      };

      Object.keys(classifier).forEach(key => {
        users[e.customerId].payments[classifier[key]] = 0
      });
    }

    e.payments.forEach(payment => users[e.customerId].payments[payment.type]++)
  });

  return Object.keys(users).map(key => {
    return {
      user: users[key].customer,
      payments: users[key].payments,
      totalCount: Object.keys(users[key].payments).reduce((acc, pKey) => acc + users[key].payments[pKey], 0)
    }
  });
}

export function transformToUserPlayedHours(data) {
  const users = {};

  data.forEach(e => {
    if (!e.customerId)
      return;

    if (!users[e.customerId]) {
      users[e.customerId] = {
        customer: e.customer,
        totalHours: 0
      };
    }

    users[e.customerId].totalHours++;
  });

  return Object.keys(users).map(key => users[key]);
}

export function transformByClassifier(data, classifier) {
  const result = {};

  Object.keys(classifier).forEach(key => {
    result[classifier[key]] = 0
  });

  data.forEach(e => {
    result[e.type]++
  });

  return Object.keys(result).map(key => {
    return {
      key,
      count: result[key]
    }
  });
}