import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import QueryService from '../../services/query.service';

class EditionsDesktopView extends React.Component {
  render() {
    const { editions } = this.props;
    return (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Лига</TableCell>
            <TableCell>Турнир</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {editions.map(edition => {
            return (
              <TableRow key={edition.id}>
                <TableCell >
                  {edition.tournament.thumbnail
                    && <DisplayImage image={edition.tournament.thumbnail} style={{ maxWidth: '50px', marginRight: '.5rem' }} />}
                  <span style={{ verticalAlign: 'super' }}>{edition.tournament.name}</span>
                </TableCell>
                <TableCell>{edition.name}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    );
  }
}

const DisplayImage = ({ image, style }) => {
  const buffer = image.content.data;
  const b64 = new Buffer(buffer).toString('base64')
  const mimeType = image.mimeType;

  return <img src={`data:${mimeType};base64,${b64}`} style={style} />
}

export default EditionsDesktopView;