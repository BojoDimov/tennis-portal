import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import DatePicker from 'material-ui-pickers/DatePicker';
import { withStyles } from '@material-ui/core/styles';

import QueryService from '../services/query.service';
import AsyncSelect from '../components/select/AsyncSelect';
import EnumSelectToggle from '../components/EnumSelectToggle';

class EditionFormModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      model: {
        startDate: null,
        endDate: null
      },
      errors: []
    }

    this.save = this.save.bind(this);

    this.handleChange = (prop) => (e) => {
      const model = this.state.model;
      model[prop] = e.target.value;
      this.setState({ model });
    }

    this.handleCustomChange = (prop) => (value) => {
      const model = this.state.model;
      model[prop] = value;

      if (prop == 'tournament') {
        if (value)
          model.tournamentId = value.id;
        else
          model.tournamentId = null;
      }

      this.setState({ model });
    };
  }

  componentDidMount() {
    this.setState({ model: this.props.model });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.model != this.props.model)
      this.setState({ model: this.props.model });
  }

  save() {
    const model = this.state.model;
    return QueryService
      .post(`/editions/${model.id ? model.id : ''}`, model)
      .then(e => this.props.onChange(e));
  }

  render() {
    const { model, errors } = this.state;
    const { onClose, classes, fullScreen } = this.props;

    return (
      <Dialog
        open={true}
        onClose={onClose}
        fullScreen={fullScreen}
        classes={{ paper: classes.root }}
      >
        <DialogTitle>
          <Typography component="span" variant="headline">Форма за издание на турнир</Typography>
        </DialogTitle>
        <DialogContent>
          <EnumSelectToggle
            value={model.status}
            enumName="Status"
            onChange={this.handleChange('status')}
          />

          <AsyncSelect
            label="Лига"
            value={model.tournament}
            query="tournaments"
            noOptionsMessage={() => 'Няма намерени лиги'}
            formatOptionLabel={(option) => <Typography component="span">
              {option.name}
              <Typography component="span" variant="caption" >{option.info}</Typography>
            </Typography>}
            onChange={this.handleCustomChange('tournament')}
          />

          <TextField
            label="Име на изданието"
            value={model.name}
            fullWidth={true}
            onChange={this.handleChange('name')}
          />

          <TextField
            label="Допълнителна информация"
            value={model.info}
            multiline={true}
            fullWidth={true}
            onChange={this.handleChange('info')}
          />

          <DatePicker
            autoOk
            label="Начало на турнира"
            labelFunc={(date) => date ? new Date(date).toLocaleDateString() : ''}
            clearable
            fullWidth={true}
            value={model.startDate}
            onChange={this.handleCustomChange('startDate')}
          />

          <DatePicker
            autoOk
            label="Край на турнира"
            labelFunc={(date) => date ? new Date(date).toLocaleDateString() : ''}
            clearable
            fullWidth={true}
            value={model.endDate}
            onChange={this.handleCustomChange('endDate')}
          />

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
  },
  truncateInfo: {
    width: '100px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  }
});

export default withStyles(styles)(
  withMobileDialog({ breakpoint: 'xs' })(EditionFormModal)
);