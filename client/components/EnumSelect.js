import React from 'react';
import PropTypes from 'prop-types';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import { EnumLocalization } from '../enums';

class EnumSelect extends React.Component {
  render() {
    const { value, onChange, EnumValues, EnumName, label, required } = this.props;

    return (
      <FormControl fullWidth={true}>
        <InputLabel required={required}>
          {label}
        </InputLabel>
        <Select
          value={value}
          onChange={onChange}
        >
          <MenuItem value="" disabled={true}>
            <em>{label}</em>
          </MenuItem>
          {Object.keys(EnumValues).map((key, i) => {
            return (
              <MenuItem key={i} value={key}>{EnumLocalization[EnumName][key]}</MenuItem>
            );
          })}
        </Select>
      </FormControl>
    );
  }
}

EnumSelect.propTypes = {
  value: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  EnumValues: PropTypes.object.isRequired,
  EnumName: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};

export default EnumSelect;