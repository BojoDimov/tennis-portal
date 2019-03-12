import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import List from '@material-ui/core/List';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

import UserService from '../services/user.service';
import QueryService from '../services/query.service';
import { l10n_text } from '../components/L10n';
import { getHour } from '../utils';
import UserProfileFormModal from './UserProfileFormModal';
import ChangePasswordModal from './ChangePasswordModal'
import InvitationsComponent from './InvitationsComponent';

import PlayerInfoComponent from './components/PlayerInfoComponent';

class TeamView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null
    }
  }


  componentDidMount() {
    QueryService
      .get(`/users/${this.props.match.params.id}/playerInfo`)
      .then(user => this.setState({ user }));
  }

  render() {
    const { user } = this.state;

    return (
      <div className="container">
        {user &&
          <Card>
            <CardContent>
              <Typography variant="headline">{user.name}</Typography>
              <PlayerInfoComponent user={user} />
            </CardContent>
          </Card>}
      </div>
    );
  }
}

export default TeamView;