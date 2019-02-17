import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import ClearIcon from '@material-ui/icons/Clear';
import { withStyles } from '@material-ui/core/styles';

class FormModal extends React.Component {
  render() {
    const { title, body, actions, onClose, classes, fullScreen, hasError } = this.props;
    const rootClass = hasError ? classes.rootWithError : classes.root;

    return (
      <Dialog
        open={true}
        onClose={onClose}
        fullScreen={fullScreen}
        classes={{ paper: rootClass }}
      >
        <DialogTitle>
          <Typography component="span" variant="headline">{title}</Typography>
          <span className={classes.closeBtn} onClick={onClose}>
            <ClearIcon />
          </span>
        </DialogTitle>
        <DialogContent>
          {body}
        </DialogContent>

        <DialogActions className={classes.btnContainer}>
          {actions}
        </DialogActions>
      </Dialog>
    );
  }
}

const styles = (theme) => ({
  root: {
    width: '600px'
  },
  rootWithError: {
    boxSizing: 'border-box',
    width: '600px',
    border: `1px solid red`,
    boxShadow: `0 0 10px red`
  },
  btnContainer: {
    '& button': {
      marginLeft: '.3rem'
    },
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      flexDirection: 'column',
      '& button': {
        marginBottom: '.3rem',
        width: '100%'
      }
    }
  },
  closeBtn: {
    position: 'absolute',
    color: theme.palette.primary.main,
    top: '5px',
    right: '5px',
    cursor: 'pointer',
    '&:hover': {
      color: theme.palette.primary.dark
    }
  }
});

export default withStyles(styles)(
  withMobileDialog({ breakpoint: 'xs' })(FormModal)
);