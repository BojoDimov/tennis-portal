import React from 'react';
import Select from 'react-select';
import NoSsr from '@material-ui/core/NoSsr';
import { withStyles } from '@material-ui/core/styles';
import SelectComponents from './components';
import styles from './styles';

import QueryService from '../../services/query.service';

export class AsyncSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: '',
      limit: 25,
      defaultLimit: 25,
      items: [],
      totalCount: null
    };
  }

  componentDidMount() {
    this.load();
  }

  load(loadMore) {
    const { items, totalCount, searchTerm, defaultLimit } = this.state;
    let limit = this.state.limit;

    if (loadMore)
      limit += defaultLimit;

    if (loadMore && items.length == totalCount)
      return;

    QueryService
      .post(`/select/${this.props.query}`, {
        searchTerm,
        limit
      })
      .then(result => this.setState({ ...result, limit }));
  }

  render() {
    const { classes, theme, value, onChange, label } = this.props;

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
        {/* <pre>item   count: {this.state.items.length}</pre>
        <pre>total  count: {this.state.totalCount}</pre>
        <pre>limit       : {this.state.limit}</pre> */}
        <NoSsr>
          <Select
            classes={classes}
            styles={selectStyles}
            components={SelectComponents}
            value={value}
            options={this.state.items}
            onChange={onChange}
            onInputChange={value => {
              this.setState({ searchTerm: value.trim() });
              this.load();
            }}
            placeholder={label}
            onMenuScrollToBottom={() => this.load(true)}
          />
        </NoSsr>
      </div>
    );
  }
}

const customStyles = {
  root: {
    flexGrow: 1,
    margin: 0
  }
};

const augmentedStyles = (theme) => {
  const original = styles(theme);
  const result = { ...original, ...customStyles };
  // console.log('Original styles', original);
  // console.log('Custom styles', customStyles);
  // console.log('Resulting styles', result);

  return result;
}

export default withStyles(augmentedStyles, { withTheme: true })(AsyncSelect);