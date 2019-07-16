import React from 'react';
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import QueryService from '../services/query.service';

class TournamentView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tournament: {
        rankings: []
      }
    }
  }

  componentDidMount() {
    QueryService
      .get(`/tournaments/${this.props.match.params.id}`)
      .then(tournament => this.setState({ tournament }));
  }

  render() {
    const tournament = this.state.tournament;
    const rankings = tournament.rankings;

    return (
      <div className="container">
        <Card>
          <CardContent>
            <Typography variant="headline">Лига {tournament.name}</Typography>
            <Typography variant="caption">{tournament.info}</Typography>

            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="none">№</TableCell>
                  <TableCell>Играч/отбор</TableCell>
                  <TableCell padding="dense">Точки</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>

                {rankings.map((ranking, index) => {
                  return (
                    <React.Fragment key={ranking.id}>
                      <TableRow>
                        <TableCell padding="none">{index + 1}</TableCell>
                        <TableCell>
                          <Link to={`/teams/${ranking.team.user1.id}`} >
                            <Typography variant="body2">{ranking.team.user1.name}</Typography>
                          </Link>
                          {ranking.team.user2 &&
                            <Link to={`/teams/${ranking.team.user2.id}`} >
                              <Typography variant="body2">{ranking.team.user2.name}</Typography>
                            </Link>}
                        </TableCell>
                        <TableCell padding="dense">
                          <Typography variant="caption">{ranking.points}</Typography>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  }
}

export default TournamentView;