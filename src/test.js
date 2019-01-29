import React from 'react';
import Typography from '@material-ui/core/Typography';
import Select from './components/select/AsyncSelect';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import { withStyles } from '@material-ui/core/styles';

class Test extends React.Component {
  render() {
    const { classes, fullScreen } = this.props;

    return (
      <div className="container">
        <div style={{ border: '1px solid blue', width: '100%', height: '100px', backgroundColor: 'white' }}>
          <Dialog
            open={true}
            onClose={null}
            fullScreen={fullScreen}
            classes={{ paper: classes.root }}
          >
            <DialogTitle>
              <Typography component="span" variant="headline">Тест</Typography>
            </DialogTitle>
            <DialogContent>
              <Select
                query="teams"
                noOptionsMessage={() => 'Няма намерени играчи/отбори'}
                filter={{
                  singleTeams: true,
                  schemeId: 1
                }}
                formatOptionLabel={(option) => {
                  return (
                    <React.Fragment>
                      <Typography component="span">{option.user1.name}</Typography>
                    </React.Fragment>
                  );
                }}
              />
            </DialogContent>

            <DialogActions className={classes.btnContainer}>
              <Button variant="contained" color="primary" className={classes.btn} onClick={() => this.save()}>
                Запис
              </Button>
              <Button variant="outlined" color="primary" className={classes.btn}>
                Отказ
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    )
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
  withMobileDialog({ breakpoint: 'xs' })(Test)
);