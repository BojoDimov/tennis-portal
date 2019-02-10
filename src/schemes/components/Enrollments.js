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
import { ApplicationMode } from '../../enums';
import { lighten } from '@material-ui/core/styles/colorManipulator';

class EnrollmentsComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openTeamModal: false,
      enrolled: []
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.scheme != this.props.scheme)
      this.getData();
  }

  getData() {
    const { scheme } = this.props;

    QueryService
      .get(`/schemes/${scheme.id}/enrollments`)
      .then(e => this.setState({ enrolled: e }));
  }

  add(team) {
    const { scheme } = this.props;
    return QueryService
      .post(`/schemes/${scheme.id}/enrollments`, {
        teamId: team.id,
        schemeId: scheme.id,
        user1Id: team.user1Id,
        user2Id: team.user2Id
      })
      .then(e => {
        this.setState({ openTeamModal: false });
        this.getData();
      });
  }

  removeEnrollment(id) {
    const { scheme } = this.props;

    return QueryService
      .delete(`/schemes/${scheme.id}/enrollments/${id}`)
      .then(() => this.getData());
  }

  render() {
    const { enrolled, openTeamModal } = this.state;
    const { scheme, classes, mode } = this.props;
    const isAdmin = (mode == ApplicationMode.ADMIN);

    return (
      <ExpansionPanel style={{ marginTop: '1rem' }} defaultExpanded>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="title">Играчи</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails style={{ flexDirection: 'column' }}>

          {mode == ApplicationMode.ADMIN
            && <div>
              <SelectTeamModal
                open={openTeamModal}
                singleTeams={scheme.singleTeams}
                onChange={(team) => this.add(team)}
                onClose={() => this.setState({ openTeamModal: false })}
              />
              <Button variant="outlined" color="primary" size="small"
                onClick={() => this.setState({ openTeamModal: true })}
              >
                Добави
            </Button>
            </div>}

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
                if (index < scheme.seed)
                  borderClass = classes.seed;
                if (index + 1 == scheme.seed)
                  borderClass = classes.seedDivider;
                if (index + 1 == scheme.maxPlayerCount)
                  borderClass = classes.enrolledDivider;
                if (index + 1 > scheme.maxPlayerCount)
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
                      <TableCell padding="dense">
                        <Typography variant="caption">няма</Typography>
                      </TableCell>
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
            </TableBody>
          </Table>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    )
  }
}

const styles = (theme) => {
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