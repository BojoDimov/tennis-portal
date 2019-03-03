import React from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import AsyncSelect from '../../components/select/AsyncSelect';
import QueryService from '../../services/query.service';
import FormModal from '../../components/FormModal';
import InvitationsComponent from '../../users/InvitationsComponent';

class InvitationsModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      invitations: [],
      selectedUser: null
    }

    this.handleChange = (user) => {
      this.setState({ selectedUser: user });
    }
  }

  componentDidMount() {
    this.getData();
  }

  getData() {
    QueryService
      .get('/invitations')
      .then(invitations => this.setState({ invitations }));
  }

  invite() {
    if (!this.state.selectedUser)
      return;

    QueryService
      .post('/invitations', {
        invitedId: this.state.selectedUser.id,
        schemeId: this.props.scheme.id
      })
      .then(() => this.getData())
      .catch(err => console.log(err));
  }

  render() {
    const { onClose, scheme } = this.props;
    const title = `Менажиране на поканите за схема ${scheme.name}`;
    const actions = <Button variant="outlined" color="primary" onClick={onClose}>Затвори</Button>
    const body = <React.Fragment>
      <Typography variant="caption">
        Ще бъдете записани за турнира, когато поканеният играч приеме.
        В падащото меню за избор на играч се показват само играчи,
        които могат да приемат поканата Ви (това означава, че отговарят на
        изискванията на турнира и не са записани).
      </Typography>
      <AsyncSelect
        label="Играч"
        value={this.state.selectedUser}
        query="invitable"
        filter={{
          schemeId: scheme.id
        }}
        noOptionsMessage={() => 'Няма намерени играчи, отговарящи на изискванията'}
        formatOptionLabel={(option) => <Typography component="span">
          {option.name}
        </Typography>}
        onChange={this.handleChange}
      />
      <InvitationsComponent invitations={this.state.invitations} />
    </React.Fragment>

    return (
      <FormModal
        enableFullWidth={true}
        onClose={onClose}
        title={title}
        body={body}
        actions={actions}
      />
    );
  }
}

export default InvitationsModal;