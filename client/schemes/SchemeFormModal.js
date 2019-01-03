import React from 'react';
import moment from 'moment';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import DatePicker from 'material-ui-pickers/DatePicker';
import DateTimePicker from 'material-ui-pickers/DateTimePicker';

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Checkbox from '@material-ui/core/Checkbox';
import Select from '@material-ui/core/Select';

import { withStyles } from '@material-ui/core/styles';

import { SchemeType } from '../enums';
import EnumSelect from '../components/EnumSelect';
import EnumSelectToggle from '../components/EnumSelectToggle';
import QueryService from '../services/query.service';


class SchemeFormModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      model: {
        // edition: null,
        // singleTeams: true,
        // maleTeams: false,
        // femaleTeams: false,
        // mixedTeams: false, 
        // ageFrom: '',
        // ageTo: '',
        // date: null,
        // registrationStartDate: null,
        // registrationEndDate: null
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
      if (prop === 'singleTeams')
        model.mixedTeams = false;

      if (prop === 'schemeType') {
        model.maxPlayerCount = '';
        model.groupCount = '';
        model.teamsPerGroup = '';
      }

      model[prop] = value;
      console.log(value);
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
    const model = Object.assign({}, this.state.model, { edition: null });
    return QueryService
      .post(`/schemes/${model.id ? model.id : ''}`, model)
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
          <Typography component="span" variant="headline">Форма за промяна/създаване на схема</Typography>
        </DialogTitle>
        <DialogContent>
          <EnumSelectToggle
            value={model.status}
            enumName="Status"
            onChange={this.handleChange('status')}
          />

          <TextField
            label="Име на схемата"
            value={model.name}
            required
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

          <EnumSelect
            label="Тип схема"
            value={model.schemeType}
            required
            fullWidth={true}
            onChange={e => this.handleCustomChange('schemeType')(e.target.value)}
            EnumValues={SchemeType}
            EnumName="SchemeType"
          />

          <Typography variant="headline" style={{ marginTop: '2rem' }}>Параметри</Typography>

          <FormControl fullWidth={true} required>
            <InputLabel>Формат</InputLabel>
            <Select
              onChange={e => this.handleCustomChange('singleTeams')(e.target.value)}
              value={model.singleTeams}
            >
              <MenuItem value={true}>Сингъл</MenuItem>
              <MenuItem value={false}>Двойки</MenuItem>
            </Select>
          </FormControl>

          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                checked={model.maleTeams}
                onChange={e => this.handleCustomChange('maleTeams')(e.target.value === 'true')}
                value={!model.maleTeams + ''}
              />
            }
            label="Мъже"
          />
          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                checked={model.femaleTeams}
                onChange={e => this.handleCustomChange('femaleTeams')(e.target.value === 'true')}
                value={!model.femaleTeams + ''} />
            }
            label="Жени"
          />

          {!model.singleTeams && <FormControlLabel
            control={
              <Checkbox
                color="primary"
                checked={model.mixedTeams}
                onChange={e => this.handleCustomChange('mixedTeams')(e.target.value === 'true')}
                value={!model.mixedTeams + ''}
              />
            }
            label="Микс"
          />}

          {model.schemeType == SchemeType.ELIMINATION
            && <TextField
              label="Брой играчи"
              value={model.maxPlayerCount}
              type="number"
              required={true}
              fullWidth={true}
              onChange={this.handleChange('maxPlayerCount')}
            />}

          {model.schemeType == SchemeType.GROUP
            && <TextField
              label="Брой групи"
              value={model.groupCount}
              type="number"
              required={true}
              fullWidth={true}
              onChange={this.handleChange('groupCount')}
            />}

          {model.schemeType == SchemeType.GROUP
            && <TextField
              label="Брой играчи в група"
              value={model.teamsPerGroup}
              type="number"
              required={true}
              fullWidth={true}
              onChange={this.handleChange('teamsPerGroup')}
            />}

          <TextField
            label="Брой поставени играчи"
            value={model.seed}
            type="number"
            fullWidth={true}
            onChange={this.handleChange('seed')}
          />

          <TextField
            label="Възраст От"
            value={model.ageFrom}
            type="number"
            fullWidth={true}
            onChange={this.handleChange('ageFrom')}
          />

          <TextField
            label="Възраст До"
            value={model.ageTo}
            type="number"
            fullWidth={true}
            onChange={this.handleChange('ageTo')}
          />


          <Typography variant="headline" style={{ marginTop: '2rem' }}>Дати</Typography>

          <DatePicker
            autoOk
            label="Дата на схемата"
            labelFunc={(date) => date ? moment(model.date).format('DD.MM.YYYY') : ''}
            clearable
            required={true}
            fullWidth={true}
            value={model.date}
            onChange={this.handleCustomChange('date')}
          />

          <DateTimePicker
            label="Начало на регистрациите"
            labelFunc={(date) => date ? moment(model.registrationStart).format('DD.MM.YYYY  HH:mm') : ''}
            clearable
            ampm={false}
            required={true}
            fullWidth={true}
            value={model.registrationStart}
            onChange={this.handleCustomChange('registrationStart')}
          />

          <DateTimePicker
            label="Край на регистрациите"
            labelFunc={(date) => date ? moment(model.registrationEnd).format('DD.MM.YYYY  HH:mm') : ''}
            clearable
            ampm={false}
            required={true}
            fullWidth={true}
            value={model.registrationEnd}
            onChange={this.handleCustomChange('registrationEnd')}
          />


          <Typography variant="headline" style={{ marginTop: '2rem' }}>Точки</Typography>

          <TextField
            label="Точки за участие"
            value={model.pPoints}
            type="number"
            fullWidth={true}
            onChange={this.handleChange('pPoints')}
          />

          <TextField
            label="Точки за победа"
            value={model.wPoints}
            type="number"
            fullWidth={true}
            onChange={this.handleChange('wPoints')}
          />

          <TextField
            label="Точки за шампион"
            value={model.cPoints}
            type="number"
            fullWidth={true}
            onChange={this.handleChange('cPoints')}
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
  }
});

export default withStyles(styles)(
  withMobileDialog({ breakpoint: 'xs' })(SchemeFormModal)
);