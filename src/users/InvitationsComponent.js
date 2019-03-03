import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TablePagination from '@material-ui/core/TablePagination';

import UserService from '../services/user.service';
import QueryService from '../services/query.service';

class InvitationsComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: UserService.getUser(),
      page: 0,
      rowsPerPage: 10
    }
  }

  accept(invitation) {
    QueryService
      .post(`/invitations/${invitation.id}`)
      .then(() => this.props.onChange())
      .catch(err => console.log(err));
  }

  cancel(invitation) {
    QueryService
      .delete(`/invitations/${invitation.id}`)
      .then(() => this.props.onChange());
  }

  render() {
    const { page, rowsPerPage, userId } = this.state;
    const { invitations } = this.props;

    return (
      <React.Fragment>
        {invitations.length == 0 && <Typography variant="caption">Нямате текущи покани</Typography>}
        <List>
          {invitations.slice(page * rowsPerPage, (page + 1) * rowsPerPage).map(inv => {
            return (
              <ListItem key={inv.id} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f3f3f3' }}>
                {userId == inv.inviterId &&
                  <Typography>{inv.invited.name}</Typography>}
                {userId == inv.invited &&
                  <Typography>{inv.inviter.name}</Typography>}
                {userId == inv.inviterId
                  && <Button
                    variant="outlined"
                    color="secondary"
                    size="small"
                    onClick={() => this.cancel(inv)}
                  >
                    Отказ на поканата
                  </Button>}
                {userId == inv.invitedId
                  && <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={() => this.accept(inv)}
                  >
                    Приемане на поканата
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