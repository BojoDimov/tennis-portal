import React from 'react';
import { Link } from 'react-router-dom';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TablePagination from '@material-ui/core/TablePagination';

import MessageModal from '../components/MessageModal';
import UserService from '../services/user.service';
import QueryService from '../services/query.service';

class InvitationsComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: null,
      page: 0,
      rowsPerPage: 10,
      // Handle errors: ExistingEnrollment, RequirementsNotMet, UserHasNoInfo
      err: null
    }
  }

  componentDidMount() {
    this.setUserId();
  }

  setUserId() {
    UserService.getAuthenticatedUser()
      .then(user => {
        if (user)
          this.setState({ userId: user.id });
        else
          this.setState({ userId: null });
      });
  }

  accept(invitation) {
    this.setState({ err: null });
    QueryService
      .post(`/invitations/${invitation.id}`)
      .then(() => this.props.onChange())
      .catch(err => this.setState({ err }));
  }

  cancel(invitation) {
    QueryService
      .delete(`/invitations/${invitation.id}`)
      .then(() => this.props.onChange())
      .catch(() => null);
  }

  render() {
    const { page, rowsPerPage, userId, err } = this.state;
    const { invitations } = this.props;

    return (
      <React.Fragment>
        <MessageModal activation={this.state.err}>
          <Typography variant="subheading" color="secondary">Възникна грешка при приемане на поканата.</Typography>
          {err && err.message == 'ExistingEnrollment' && <React.Fragment>
            <Typography>Някой от играчите вече е записан за този турнир.</Typography>
          </React.Fragment>}
          {err && err.message == 'RequirementsNotMet' && <React.Fragment>
            <Typography>Някой от играчите не покрива следните ограничения на турнира:</Typography>
            <Typography variant="caption">{err.errors.map(e => e == 'gender' ? 'пол' : 'възраст').join(', ')}</Typography>
          </React.Fragment>}
          {err && err.message == 'UserHasNoInfo' && <React.Fragment>
            <Typography>Някой от играчите няма въведена информация за пол и/или дата на раждане, които са нужни за записване.</Typography>
          </React.Fragment>}
        </MessageModal>
        {invitations.length == 0 && <Typography variant="caption">Нямате текущи покани</Typography>}
        <List>
          {invitations.slice(page * rowsPerPage, (page + 1) * rowsPerPage).map(inv => {
            return (
              <ListItem key={inv.id} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f3f3f3' }}>
                {userId == inv.inviterId &&
                  <Typography>{inv.invited.name}</Typography>}
                {userId == inv.invitedId &&
                  <Typography>{inv.inviter.name}</Typography>}

                <div>
                  <Link to={`/editions/${inv.scheme.editionId}`}>
                    <Typography variant="body2">
                      {inv.scheme.edition.name}
                    </Typography>
                  </Link>
                  <Link to={`/schemes/${inv.scheme.id}`}>
                    <Typography variant="body2">
                      {inv.scheme.name}
                    </Typography>
                  </Link>
                </div>
                {userId == inv.inviterId
                  && <Button
                    variant="outlined"
                    color="secondary"
                    size="small"
                    onClick={() => this.cancel(inv)}
                  >
                    Отказване
                  </Button>}
                {userId == inv.invitedId
                  && <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={() => this.accept(inv)}
                  >
                    Приемане
                  </Button>}
              </ListItem>
            );
          })}
        </List>
        {invitations.length > 0 && <TablePagination
          component="div"
          count={invitations.length}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
          labelRowsPerPage="Покажи:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} от ${count}`}
          page={page}
          onChangePage={(e, page) => this.setState({ page })}
          onChangeRowsPerPage={e => this.setState({ rowsPerPage: e.target.value, page: 0 })}
        />}
      </React.Fragment>
    );
  }
}

export default InvitationsComponent