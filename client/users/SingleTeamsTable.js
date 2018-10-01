import React from 'react';
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

class SingleTeamsTable extends React.Component {
  render() {
    const { teams } = this.props;

    return (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Играч</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {teams.map((team) => {
            return (
              <TableRow key={team.id}>
                <TableCell>
                  <Link to={`/teams/${team.user1.id}`} >
                    <Typography variant="body2">{team.user1.name}</Typography>
                  </Link>
                  {/* {enrollment.team.user2 &&
                  <Link to={`/teams/${enrollment.team.user2.id}`} >
                    <Typography variant="body2">{enrollment.team.user2.name}</Typography>
                  </Link>} */}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    );
  }
}

export default SingleTeamsTable;