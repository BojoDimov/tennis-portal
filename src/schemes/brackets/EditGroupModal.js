import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import IconButton from '@material-ui/core/IconButton';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import { withStyles } from '@material-ui/core/styles';

import AsyncSelect from '../../components/select/AsyncSelect';
import QueryService from '../../services/query.service';

class EditGroupModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      model: {
        teams: []
      },
      errors: []
    };

    this.setTeam = (index) => (value) => {
      const model = this.state.model;
      model.teams[index].team = value;
      model.teams[index].teamId = (value || { id: null }).id;
      this.setState({ model });
    }
  }

  componentDidMount() {
    this.setState({ model: this.props.model });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.model != this.props.model)
      this.setState({ model: this.props.model });
  }

  addTeam() {
    const model = this.state.model;
    model.teams.push({
      groupId: model.id,
      team: null,
      teamId: null,
      order: model.teams.length + 1
    });
    this.setState({ model });
  }

  removeTeam(index) {
    const model = this.state.model;
    model.teams.splice(index, 1);
    this.setState({ model });
  }

  save() {
    const model = this.state.model;
    if (model.id)
      return QueryService
        .post(`/schemes/${this.props.match.params.id}/groups/${model.id}`, model)
        .then(e => this.props.onClose())
        .catch(errors => this.setState({ errors }));
    else
      return QueryService
        .post(`/schemes/${this.props.match.params.id}/groups`, model)
        .then(e => this.props.onClose())
        .catch(errors => this.setState({ errors }));
  }

  render() {
    const { model, errors } = this.state;
    const { onClose, classes, fullScreen, scheme } = this.props;
    console.log(model);

    return (
      <Dialog
        open={true}
        onClose={onClose}
        fullScreen={fullScreen}
        classes={{ paper: classes.root }}
      >
        <DialogTitle>
          <Typography component="span" variant="headline">Създаване/промяна на група {getGroupHeader(model.group)}</Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="caption">Отбори</Typography>
          {model.teams.map((groupTeam, index) => {
            return (
              <div key={groupTeam.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography style={{ marginRight: '1rem' }}>{groupTeam.order}</Typography>
                <AsyncSelect
                  value={groupTeam.team}
                  query="teams"
                  disableClear
                  filter={{
                    singleTeams: scheme.singleTeams,
                    schemeId: scheme.id
                  }}
                  noOptionsMessage={() => 'Няма намерени играчи/отбори'}
                  formatOptionLabel={(option) => {
                    return (
                      <React.Fragment>
                        <Typography component="span">{option.user1.name}</Typography>
                        {!scheme.singleTeams && <Typography component="span">{option.user2.name}</Typography>}
                      </React.Fragment>
                    );
                  }}
                  onChange={this.setTeam(index)}
                />
                <IconButton color="secondary" onClick={() => this.removeTeam(index)}>
                  <DeleteForeverIcon />
                </IconButton>
              </div>
            );
          })}
          <Button style={{ marginTop: '1rem' }} variant="contained" color="primary" size="small" onClick={() => this.addTeam()}>Добави</Button>
        </DialogContent>

        <DialogActions className={classes.btnContainer}>
          <Button variant="contained" color="primary" className={classes.btn} onClick={() => this.save()}>
            Запис
          </Button>
          <Button variant="outlined" color="primary" className={classes.btn} onClick={onClose}>
            Отказ
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

function getGroupHeader(groupOrder) {
  if (groupOrder == null || groupOrder == undefined)
    return null;
  return String.fromCharCode("А".charCodeAt(0) + groupOrder);
}

const styles = (theme) => ({
  root: {
    width: '600px'
  },
  btnContainer: {
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      flexDirection: 'column'
    }
  },
  btn: {
    [theme.breakpoints.down('sm')]: {
      marginBottom: '.3rem',
      width: '100%'
    }
  }
});

export default withStyles(styles)(
  withMobileDialog({ breakpoint: 'xs' })(EditGroupModal)
);