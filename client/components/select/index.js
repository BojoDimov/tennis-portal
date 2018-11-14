import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import NoSsr from '@material-ui/core/NoSsr';
import { withStyles } from '@material-ui/core/styles';
import SelectComponents from './components';
import styles from './styles';

class SingleSelect extends React.Component {
  render() {
    const {
      disableClear,
      disableSearch,
      label,
      value,
      options,
      getOptionLabel,
      getOptionValue,
      formatOptionLabel,
      noOptionsMessage,
      onChange,

      classes, theme
    } = this.props;

    const selectStyles = {
      input: base => ({
        ...base,
        color: theme.palette.text.primary,
        '& input': {
          font: 'inherit',
        },
      }),
    };

    let _getOptionLabel = getOptionLabel || ((option) => option.name);
    let _getOptionValue = getOptionValue || ((option) => option.id);
    let _noOptionsMessage = noOptionsMessage || (() => "Няма елементи в колекцията");

    return (
      <div className={classes.root}>
        <NoSsr>
          <Select
            isClearable={!disableClear}
            isSearchable={!disableSearch}
            textFieldProps={{
              label,
              InputLabelProps: {
                shrink: Boolean(value)
              }
            }}
            value={value}
            options={options}
            getOptionLabel={_getOptionLabel}
            getOptionValue={_getOptionValue}
            formatOptionLabel={formatOptionLabel}
            noOptionsMessage={_noOptionsMessage}
            onChange={onChange}
            classes={classes}
            styles={selectStyles}
            components={SelectComponents}
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

const customStyles = {
  root: {
    flexGrow: 1,
    margin: 0,
    cursor: 'pointer'
  }
};

const augmentedStyles = (theme) => {
  const original = styles(theme);
  const result = { ...original, ...customStyles };
  return result;
}

export default withStyles(augmentedStyles, { withTheme: true })(SingleSelect);
