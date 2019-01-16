import React from 'react';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

import * as Enums from '../enums';

class EnumSelectToggle extends React.Component {
  render() {
    const { style, enumName, value, onChange, classes } = this.props;
    const values = Enums[enumName];
    const translation = Enums.EnumLocalization[enumName];

    return (
      <div style={style} className={classes.root}>
        {Object.keys(values).map((key, index) => {
          let btnClass = classes.btn;
          if (index == 0)
            btnClass = classes.leftRounded;

          return (
            <Button
              className={classes.btn}
              key={key}
              variant={values[key] === value ? 'contained' : 'outlined'}
              color="primary" size="small" onClick={e => {
                e.target.value = values[key];
                return onChange(e);
              }}>
              {translation[values[key]]}
            </Button>
          );
        })}
      </div>
    );
  }
}

const styles = (theme) => ({
  leftRounded: {
    borderTopLeftRadius: '3px',
    borderBottomLeftRadius: '3px',
    borderTopRightRadius: '0',
    borderBottomRightRadius: '0',
    borderRight: 'none',
    '&:hover': {
      borderRight: 'none'
    }
  },
  rightRounded: {
    borderRadius: '5px',
    borderLeft: 'none'
  },
  btn: {
    borderRadius: '0',
    boxSizing: 'border-box'
  }
});

export default withStyles(styles)(EnumSelectToggle);