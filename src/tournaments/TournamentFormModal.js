import React from 'react';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import { withStyles } from '@material-ui/core/styles';

import ImageField from '../components/ImageField';
import EnumSelectToggle from '../components/EnumSelectToggle';
import QueryService from '../services/query.service';

class TournamentFormModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      model: {},
      errors: []
    }

    this.save = this.save.bind(this);

    this.handleChange = (prop) => (e) => {
      const model = this.state.model;
      model[prop] = e.target.value;
      this.setState({ model });
    }

    this.handleThumbnail = (e) => {
      const model = this.state.model;

      if (!e || !e.target.files || !e.target.files[0]) {
        model.thumbnail = null;
        model.thumbnailId = null;
        this.setState({ model });
        return;
      }

      return QueryService
        .uploadFile(e.target.files[0])
        .then(file => {
          model.thumbnail = file;
          model.thumbnailId = file.id;
          this.setState({ model });
        });
    }
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
      .post(`/tournaments/${model.id ? model.id : ''}`, model)
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
        onClick={e => e.stopPropagation()}
      >
        <DialogTitle>
          <Typography component="span" variant="headline">Създаване/промяна на лига</Typography>
        </DialogTitle>
        <DialogContent>
          <EnumSelectToggle
            value={model.status}
            enumName="Status"
            onChange={this.handleChange('status')}
          />

          <Typography variant="caption" style={{ marginTop: '.5rem' }}>Лого</Typography>
          <ImageField
            value={model.thumbnail}
            onChange={this.handleThumbnail}
            style={{ marginTop: '.5rem' }}
            imageStyle={{ maxWidth: '50px' }}
          />

          <TextField
            label="Име на лигата"
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
  withMobileDialog({ breakpoint: 'xs' })(TournamentFormModal)
);