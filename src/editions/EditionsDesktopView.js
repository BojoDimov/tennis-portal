import React from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import DisplayImage from '../components/DisplayImage';
import QueryService from '../services/query.service';

class EditionsDesktopView extends React.Component {
  render() {
    const { editions } = this.props;
    return (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Лига</TableCell>
            <TableCell>Турнир</TableCell>
            <TableCell>Провеждане</TableCell>
            {/* <TableCell padding="none"></TableCell> */}
          </TableRow>
        </TableHead>
        <TableBody>
          {editions.map(edition => {
            return (
              <TableRow key={edition.id}>
                <TableCell >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {edition.tournament.thumbnail
                      && <DisplayImage image={edition.tournament.thumbnail} style={{ maxWidth: '50px', marginRight: '.5rem' }} />}
                    <Link to={`/tournaments/${edition.tournament.id}`}>
                      <Typography variant="body2">{edition.tournament.name}</Typography>
                    </Link>
                  </div>
                </TableCell>
                <TableCell>
                  <Link to={`/editions/${edition.id}`}>
                    <Typography variant="body2">{edition.name}</Typography>
                  </Link>
                </TableCell>
                <TableCell>
                  {moment(edition.startDate).format('DD.MM.YYYY')} - {moment(edition.endDate).format('DD.MM.YYYY')}
                </TableCell>
                {/* <TableCell>
                  <Link to={`/editions/${edition.id}`}>
                    <Button variant="text" color="primary">Преглед</Button>
                  </Link>
                </TableCell> */}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    );
  }
}

export default EditionsDesktopView;