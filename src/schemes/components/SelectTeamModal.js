import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import { withStyles } from '@material-ui/core/styles';

import AsyncSelect from '../../components/select/AsyncSelect';

class SelectTeamModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      model: null
    };
  }

  render() {
    const { onClose, onChange, classes, fullScreen, open, singleTeams } = this.props;
    const { model } = this.state;
    return (
      <Dialog
        open={open}
        onClose={onClose}
        fullScreen={fullScreen}
        classes={{ paper: classes.root }}
      >
        <DialogTitle>
          <Typography component="span" variant="headline">Избор на играч/двойка</Typography>
        </DialogTitle>
        <DialogContent>
          <AsyncSelect
            value={model}
            label="Избор на играч/двойка"
            query="teams"
            filter={{
              singleTeams
            }}
            formatOptionLabel={(option) => {
              return (
                <Typography>{option.user1.name}</Typography>
              );
            }}
            onChange={model => this.setState({ model })} />
        </DialogContent>

        <DialogActions className={classes.btnContainer}>
          <Button disabled={!model} variant="contained" color="primary" className={classes.btn} onClick={() => onChange(model)}>
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
    width: '600px',
    height: '600px'
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
  withMobileDialog({ breakpoint: 'xs' })(SelectTeamModal)
);