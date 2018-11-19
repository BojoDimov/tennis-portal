import React from 'react';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

class DailyStatisticsTable extends React.Component {
  render() {
    const { translation } = this.props;
    const data = transformData(this.props.data, this.props.classifier);
    console.log(data);
    return (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Метод на плащане</TableCell>
            <TableCell>Отчетени часове</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {}
        </TableBody>
      </Table>
    );
  }
}

function transformData(data, classifier) {
  const reduced = data
    .reduce((acc, curr) => acc.concat(curr.payments), []);

  const result = {};

  Object.keys(classifier).forEach(key => {
    result[classifier[key]] = 0
  });

  reduced.forEach(e => {
    result[e.type]++
  });

  return result;
}