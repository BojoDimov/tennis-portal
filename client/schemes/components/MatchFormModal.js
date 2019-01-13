import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import { withStyles } from '@material-ui/core/styles';

import QueryService from '../../services/query.service';

class MatchFormModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      model: {},
      errors: []
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
      >
        <DialogTitle>
          <Typography component="span" variant="headline">Въвеждане/промяна на резултат</Typography>
        </DialogTitle>
        <DialogContent>
          <Typography>
            <Typography variant="caption">Играч 1</Typography>
            Панайот Давидов
          </Typography>

          <Typography>
            <Typography variant="caption">Играч 2</Typography>
            Виктория Петрова
          </Typography>
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