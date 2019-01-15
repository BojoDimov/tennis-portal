import React from 'react';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const styles = (theme) => ({
  root: {
    display: 'inline-flex',
    flexDirection: 'column'
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '.3rem',
    '& div': {
      width: '100px',
      height: '20px',
      border: '1px solid lightgrey'
    }
  },
  reserved: {
    backgroundColor: theme.palette.primary.light
  },
  taken: {
    backgroundColor: theme.palette.secondary.light
  },
  unavailiable: {
    background: 'url(assets/empty.png)'
  }
});

class Legend extends React.Component {
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <div className={classes.item}>
          <div></div>
          <Typography variant="caption"> - свободен час</Typography>
        </div>
        <div className={classes.item}>
          <div className={classes.reserved}></div>
          <Typography variant="caption"> - резервиран от потребителя</Typography>
        </div>
        <div className={classes.item}>
          <div className={classes.taken}></div>
          <Typography variant="caption"> - зает час</Typography>
        </div>
        <div className={classes.item}>
          <div className={classes.unavailiable}></div>
          <Typography variant="caption"> - затворено игрище</Typography>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(Legend);