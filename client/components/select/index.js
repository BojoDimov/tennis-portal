import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import NoSsr from '@material-ui/core/NoSsr';
import { withStyles } from '@material-ui/core/styles';
import SelectComponents from './components';
import styles from './styles';

class SingleSelect extends React.Component {
  render() {
    const { classes, theme, items, value, onChange, placeholder } = this.props;
    const _items = items.map(item => ({
      value: item.id,
      label: item.name
    }));

    const selectStyles = {
      input: base => ({
        ...base,
        color: theme.palette.text.primary,
        '& input': {
          font: 'inherit',
        },
      }),
    };

    return (
      <div className={classes.root}>
        <NoSsr>
          <Select
            classes={classes}
            styles={selectStyles}
            options={_items}
            isClearable={true}
            components={SelectComponents}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
          />
        </NoSsr>
      </div>
    );
  }
}

SingleSelect.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(SingleSelect);
