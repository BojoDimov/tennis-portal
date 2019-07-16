import React from 'react';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const styles = () => ({
  root: {
    border: '1px solid red',
    position: 'absolute',
    paddingTop: '3rem',
    top: 0,
    left: 0,
    right: 0,
    zIndex: -1,
    fontWeight: 700
  }
});

class Home extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <React.Fragment>
        <div className={"container " + classes.root}>
          <Typography variant="display3">Тенис клуб Диана</Typography>
          <Typography variant="display2">За професионалисти и аматьори</Typography>
        </div>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(Home);