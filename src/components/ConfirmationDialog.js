import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import { withStyles } from '@material-ui/core/styles';

class ConfirmationDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    };

    this.open = (e) => this.setState({ isOpen: true });
    this.close = (e) => this.setState({ isOpen: false });
    this.accept = (e) => {
      this.close(e);
      this.props.onAccept(e);
    }
  }

  render() {
    const { isOpen } = this.state;
    const { title, body, onAccept, children, classes, style } = this.props;

    return (
      <span style={style}>
        <Dialog open={isOpen} onClose={this.close} classes={{ paper: classes.root }}>
          <DialogTitle>{title}</DialogTitle>
          <DialogContent>{body}</DialogContent>
          <DialogActions className={classes.btnContainer}>
            <Button variant="contained" color="primary" className={classes.btn} onClick={this.accept}>
              Да
          </Button>
            <Button variant="outlined" color="primary" className={classes.btn} onClick={this.close}>
              Не
          </Button>
          </DialogActions>
        </Dialog>
        <span onClick={this.open}>
          {children}
        </span>
      </span>
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

export default withStyles(styles)(ConfirmationDialog);