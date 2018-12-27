import React from 'react';
import { Link } from 'react-router-dom';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import { withStyles } from '@material-ui/core/styles';

import SelectTeamModal from './SelectTeamModal';
import QueryService from '../../services/query.service';
import UserService from '../../services/user.service';
import { lighten } from '@material-ui/core/styles/colorManipulator';

class EnrollmentsComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openTeamModal: false,
      enrolled: [],
      queued: [],
      isAdmin: true
    }
  }

  componentDidMount() {
    this.getData();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.schemeId != this.props.schemeId)
      this.getData();
  }

  getData() {
    const { schemeId } = this.props;

    QueryService
      .get(`/schemes/${schemeId}/enrollments`)
      .then(e => this.setState(e));
  }

  add(team) {
    const { schemeId } = this.props;
    return QueryService
      .post(`/schemes/${schemeId}/enrollments`, {
        teamId: team.id,
        schemeId: schemeId,
        user1Id: team.user1Id,
        user2Id: team.user2Id
      })
      .then(e => {
        this.setState({ openTeamModal: false });
        this.getData();
      });
  }

  removeEnrollment(id) {
    const { schemeId } = this.props;

    return QueryService
      .delete(`/schemes/${schemeId}/enrollments/${id}`)
      .then(() => this.getData());
  }

  render() {
    const { enrolled, queued, isAdmin, openTeamModal } = this.state;
    const { classes } = this.props;
    const seed = 3;
    const count = 5;

    return (
      <ExpansionPanel style={{ marginTop: '1rem' }}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="title">Играчи</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails style={{ flexDirection: 'column' }}>

          <div>
            <SelectTeamModal
              open={openTeamModal}
              onChange={(team) => this.add(team)}
              onClose={() => this.setState({ openTeamModal: false })}
            />
            <Button variant="outlined" color="primary" size="small"
              onClick={() => this.setState({ openTeamModal: true })}
            >
              Добави
            </Button>
          </div>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="none">№</TableCell>

                <TableCell>Отбор</TableCell>
                <TableCell padding="dense">Точки</TableCell>
                {isAdmin && <TableCell padding="none"></TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>

              {enrolled.map((enrollment, index) => {
                let borderClass = classes.default;
                if (index < seed)
                  borderClass = classes.seed;
                if (index + 1 == seed)
                  borderClass = classes.seedDivider;
                if (index + 1 == count)
                  borderClass = classes.enrolledDivider;
                if (index + 1 > count)
                  borderClass = classes.enrolled;

                return (
                  <React.Fragment key={enrollment.id}>
                    <TableRow className={borderClass}>
                      <TableCell padding="none">{index + 1}</TableCell>
                      <TableCell>
                        <Link to={`/teams/${enrollment.team.user1.id}`} >
                          <Typography variant="body2">{enrollment.team.user1.name}</Typography>
                        </Link>
                        {enrollment.team.user2 &&
                          <Link to={`/teams/${enrollment.team.user2.id}`} >
                            <Typography variant="body2">{enrollment.team.user2.name}</Typography>
                          </Link>}
                      </TableCell>
                      {enrollment.team.rankings[0] &&
                        <TableCell>{enrollment.team.rankings[0].points}</TableCell>}
                      {!enrollment.team.rankings[0] &&
                        <TableCell><Typography variant="caption">няма</Typography></TableCell>}
                      {isAdmin && <TableCell padding="none">
                        <Button variant="text" color="secondary" size="small"
                          onClick={() => this.removeEnrollment(enrollment.id)}
                        >
                          <DeleteForeverIcon />
                        </Button>
                      </TableCell>}
                    </TableRow>
                  </React.Fragment>
                );
              })}

              {queued.map((enrollment, index) => {
                return (
                  <React.Fragment key={enrollment.id}>
                    <TableRow>
                      <TableCell padding="none">{enrolled.length + index + 1}</TableCell>
                      <TableCell>{enrollment.team.user1.name}</TableCell>
                      {enrollment.team.rankings[0] &&
                        <TableCell padding="dense">{enrollment.team.rankings[0].points}</TableCell>}
                      {!enrollment.team.rankings[0] &&
                        <TableCell padding="dense"><Typography variant="caption">няма</Typography></TableCell>}
                      {isAdmin && <TableCell padding="none">
                        <Button variant="text" color="primary" size="small"
                          style={{ color: 'darkred' }}
                          onClick={() => this.removeEnrollment(enrollment.id)}
                        >
                          <DeleteForeverIcon />
                        </Button>
                      </TableCell>}
                    </TableRow>
                  </React.Fragment>
                );
              })}

            </TableBody>
          </Table>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    )
  }
}

const styles = (theme) => {
  console.log(theme);
  return ({
    root: {
      marginLeft: 0
    },
    seedDivider: {
      backgroundColor: lighten(theme.palette.primary.main, .9),
      borderBottom: `2px solid ${theme.palette.primary.light}`
    },
    enrolledDivider: {
      borderBottom: `2px solid ${theme.palette.secondary.light}`
    },
    seed: {
      backgroundColor: lighten(theme.palette.primary.main, .9)
    },
    enrolled: {
      backgroundColor: lighten(theme.palette.secondary.main, .9),
    }
  });
}

export default withStyles(styles)(EnrollmentsComponent);