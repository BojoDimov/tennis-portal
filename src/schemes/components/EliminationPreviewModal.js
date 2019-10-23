import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

import QueryService from '../../services/query.service';
import FormModal from '../../components/FormModal';
import ConfirmationDialog from '../../components/ConfirmationDialog';

class EliminationPreviewModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      teams: []
    };
  }

  componentDidMount() {
    this.setState({ teams: this.props.teams });
  }

  draw() {
    return QueryService.post(`/schemes/${this.props.scheme.id}/draw/eliminationPhase`, { teams: this.state.teams })
      .then(() => this.props.onDraw());
  }

  changeOrder(e, index) {
    let teams = this.state.teams;
    teams[index].order = e.target.value;
    this.setState({ teams });
  }

  reorder() {
    let teams = this.state.teams;
    teams.sort((a, b) => {
      if (!b.order)
        return -1;
      if (!a.order)
        return 1;
      return a.order - b.order;
    });
    this.setState({ teams });
  }

  render() {
    const { teams } = this.state;
    const { scheme, onClose } = this.props;

    const title = `Подредба на играчи/отбори преди изтегляне на елиминационна схема`;
    const actions = <React.Fragment>
      <Button variant="outlined" color="primary" size="small" onClick={() => this.reorder()}>
        Пренареждане
      </Button>
      <ConfirmationDialog
        title="Изтегляне на схема"
        body={<Typography>Сигурни ли сте че искате да изтеглите схемата</Typography>}
        onAccept={() => this.draw()}
      >
        <Button variant="contained" color="primary" size="small" >
          Изтегляне на схема
        </Button>
      </ConfirmationDialog>
    </React.Fragment>;

    const body = <List>
      <Typography color="secondary">Играч/oтбор без позиция бива изключен от схемата!</Typography>
      {teams.map((team, index) => {
        return (<React.Fragment key={index}>
          <div style={{ display: 'flex', width: '100%' }}>
            <div style={{ marginRight: '.3em', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Typography>{index + 1}.</Typography>
            </div>
            {team.team && <div style={{ flexBasis: '70%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Typography>{team.team.user1.name}</Typography>
              {team.team.user2 && <Typography>{team.team.user2.name}</Typography>}
            </div>}
            {!team.team && <div style={{ flexBasis: '70%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Typography>BYE</Typography>
            </div>}
            <div style={{}}>
              <TextField label={team.order ? 'Позиция' : 'НЕ ИГРАЕ'} value={team.order} type="number" onChange={e => this.changeOrder(e, index)} />
            </div>
          </div>
          <Divider />
        </React.Fragment>);
      })}
    </List>
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

export default EliminationPreviewModal;