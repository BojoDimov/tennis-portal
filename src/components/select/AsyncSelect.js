import React from 'react';
import Select from 'react-select';
import NoSsr from '@material-ui/core/NoSsr';
import { withStyles } from '@material-ui/core/styles';
import SelectComponents from './components';
import styles from './styles';

import QueryService from '../../services/query.service';

class AsyncSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: '',
      limit: 25,
      defaultLimit: 25,
      options: [],
      totalCount: null
    };
  }

  componentDidMount() {
    this.load();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.filter != this.props.filter)
      this.load();
  }

  load(loadMore) {
    const { options, totalCount, searchTerm, defaultLimit } = this.state;
    let limit = this.state.limit;

    if (loadMore)
      limit += defaultLimit;

    if (loadMore && options.length == totalCount)
      return;

    QueryService
      .post(`/select/${this.props.query}`, {
        ...this.props.filter,
        searchTerm,
        limit
      })
      .then(result => this.setState({ ...result, limit }));
  }

  render() {
    const {
      disableClear,
      disableSearch,
      disabled,
      label,
      value,
      query,
      filter,
      getOptionLabel,
      getOptionValue,
      formatOptionLabel,
      noOptionsMessage,
      onChange,

      classes, theme
    } = this.props;

    const selectStyles = {
      container: base => ({
        ...base,
        position: 'default'
      }),
      menuList: base => ({
        ...base,
        paddingBottom: '3rem'
      }),
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
        {/* <pre>item   count: {this.state.options.length}</pre>
        <pre>total  count: {this.state.totalCount}</pre>
        <pre>limit       : {this.state.limit}</pre> */}
        <NoSsr>
          <Select
            isClearable={!disableClear}
            isSearchable={!disableSearch}
            isDisabled={Boolean(disabled)}
            textFieldProps={{
              label,
              InputLabelProps: {
                shrink: Boolean(value) || Boolean(this.state.searchTerm)
              }
            }}
            value={value}
            options={this.state.options}
            getOptionLabel={_getOptionLabel}
            getOptionValue={_getOptionValue}
            formatOptionLabel={formatOptionLabel}
            noOptionsMessage={_noOptionsMessage}
            onChange={onChange}
            onInputChange={value => {
              this.setState({ searchTerm: value.trim() });
              this.load();
            }}
            onMenuScrollToBottom={() => this.load(true)}
            classes={classes}
            styles={selectStyles}
            components={SelectComponents}
          />
        </NoSsr>
      </div>
    );
  }
}

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

export default withStyles(augmentedStyles, { withTheme: true })(AsyncSelect);