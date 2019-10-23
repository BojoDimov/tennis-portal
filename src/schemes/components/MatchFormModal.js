import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import { withStyles } from '@material-ui/core/styles';

import QueryService from '../../services/query.service';
import AsyncSelect from '../../components/select/AsyncSelect';

class MatchFormModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      model: {
        sets: []
      },
      errors: []
    }

    this.handleChange = (prop) => (event) => {
      let model = this.state.model;
      model[prop] = event.target.value;
      this.setState({ model });
    }

    this.handleCustomChange = (prop) => (value) => {
      const model = this.state.model;

      if (prop === 'team1') {
        model.team1 = value;
        model.team1Id = (value || { id: null }).id
      }

      if (prop === 'team2') {
        model.team2 = value;
        model.team2Id = (value || { id: null }).id
      }

      if (prop === 'withdraw') {
        if (value == model.team1)
          model.withdraw = 1;
        else if (value == model.team2)
          model.withdraw = 2;
        else model.withdraw = null;
      }

      this.setState({ model });
    }

    this.handleSetsChange = (index, prop) => (event) => {
      const model = this.state.model;
      model.sets[index][prop] = event.target.value;
      this.setState({ model });
    }
  }

  componentDidMount() {
    this.setState({ model: this.formatSets(this.props.model) });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.model != this.props.model)
      this.setState({ model: this.formatSets(this.props.model) });
  }

  formatSets(match) {
    match.sets = [1, 2, 3, 4, 5].map(order => {
      let existingSet = match.sets.find(set => set.order == order);
      if (existingSet && existingSet.tiebreaker) {
        existingSet.team1 = existingSet.team1 < existingSet.team2 ?
          `${existingSet.team1}(${existingSet.tiebreaker})` : existingSet.team1;
        existingSet.team2 = existingSet.team2 < existingSet.team1 ?
          `${existingSet.team2}(${existingSet.tiebreaker})` : existingSet.team2;
      }
      return existingSet || { order, matchId: match.id || null };
    });
    return match;
  }

  save() {
    const model = this.state.model;
    if (model.id)
      return QueryService
        .post(`/schemes/${model.schemeId}/matches/${model.id}`, model)
        .then(e => this.props.onChange(e));
    else
      return QueryService
        .post(`/schemes/${model.schemeId}/matches`, model)
        .then(e => this.props.onChange(e));
  }

  render() {
    const { model, errors } = this.state;
    const { onClose, classes, fullScreen, singleTeams } = this.props;

    const enableTeamChange = model.round == 1 || model.groupId;
    const label = (singleTeams ? 'Играч ' : 'Отбор ');

    return (
      <Dialog
        open={true}
        onClose={onClose}
        fullScreen={fullScreen}
        classes={{ paper: classes.root }}
      >
        <DialogTitle>
          <Typography component="span" variant="headline">
            Въвеждане/промяна на мач {model.match} рунд {model.round}
          </Typography>
        </DialogTitle>
        <DialogContent>
          {enableTeamChange && <React.Fragment>
            <AsyncSelect
              label={label + 1}
              value={model.team1}
              query="teams"
              filter={{
                singleTeams: singleTeams,
                schemeId: model.schemeId,
                groupId: model.groupId
              }}
              noOptionsMessage={() => 'Няма намерени играчи/отбори'}
              formatOptionLabel={(option) => {
                return (
                  <div>
                    <Typography >{option.user1.name}</Typography>
                    {option.user2 && <Typography>{option.user2.name}</Typography>}
                  </div>
                );
              }}
              onChange={this.handleCustomChange('team1')}
            />

            <AsyncSelect
              label={label + 2}
              value={model.team2}
              query="teams"
              filter={{
                singleTeams: singleTeams,
                schemeId: model.schemeId,
                groupId: model.groupId
              }}
              noOptionsMessage={() => 'Няма намерени отбори'}
              formatOptionLabel={(option) => {
                return (
                  <div>
                    <Typography>{option.user1.name}</Typography>
                    {option.user2 && <Typography>{option.user2.name}</Typography>}
                  </div>
                );
              }}
              onChange={this.handleCustomChange('team2')}
            />
          </React.Fragment>}

          {!enableTeamChange &&
            <React.Fragment><Typography>
              <Typography variant="caption">{label + 1}</Typography>
              {model.team1 ? model.team1.user1.name : 'BYE'}
              {!singleTeams && model.team1 && <Typography>{model.team1.user2.name}</Typography>}
            </Typography>

              <Typography>
                <Typography variant="caption">{label + 2}</Typography>
                {model.team2 ? model.team2.user1.name : 'BYE'}
                {!singleTeams && model.team2 && <Typography>{model.team2.user2.name}</Typography>}
              </Typography>
            </React.Fragment>}

          {model.team1 && model.team2 &&
            <FormControl style={{ width: '300px' }}>
              <InputLabel shrink>Отказал се</InputLabel>
              <Select
                onChange={this.handleChange('withdraw')}
                value={model.withdraw}
              >
                <MenuItem value={null}>Няма</MenuItem>
                <MenuItem value={1}>
                  <Typography>{model.team1.user1.name} </Typography>
                  {model.team1.user2 && <Typography>{model.team1.user2.name} </Typography>}
                </MenuItem>
                <MenuItem value={2}>
                  <Typography>{model.team2.user1.name} </Typography>
                  {model.team2.user2 && <Typography>{model.team2.user2.name} </Typography>}
                </MenuItem>
              </Select>
            </FormControl>}

          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="dense">Сет №</TableCell>
                <TableCell padding="none">{label + 1}</TableCell>
                <TableCell padding="none">{label + 2}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {model.sets.map((set, index) => {
                return (
                  <TableRow key={set.order}>
                    <TableCell padding="dense">{set.order}</TableCell>
                    <TableCell padding="none">
                      <input value={set.team1} type="text" style={{ maxWidth: '40px' }} onChange={this.handleSetsChange(index, 'team1')} />
                    </TableCell>
                    <TableCell padding="none">
                      <input value={set.team2} type="text" style={{ maxWidth: '40px' }} onChange={this.handleSetsChange(index, 'team2')} />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
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
  withMobileDialog({ breakpoint: 'xs' })(MatchFormModal)
);