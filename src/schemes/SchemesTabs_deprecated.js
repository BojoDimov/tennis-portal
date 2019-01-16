import React from 'react';
import PropTypes from 'prop-types';


import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

class SchemesTabs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0
    }

    this.handleChange = (event, index) => {
      this.setState({ index });
    };
  }



  componentDidMount() {
    let schemes = this.props.schemes;
    // if (schemes.length > 0)
    //   this.setState({ index: schemes[0].id });
  }

  render() {
    const { index } = this.state;
    const { schemes } = this.props;

    return (
      <Tabs
        value={index}
        onChange={this.handleChange}
        indicatorColor="primary"
        textColor="primary"
        scrollable
        scrollButtons="auto"
      >
        {schemes.map(scheme => {
          return (
            <Tab label={scheme.name} key={scheme.id} />
          );
        })}
      </Tabs>
    );
  }
}

SchemesTabs.propTypes = {
  schemes: PropTypes.array.isRequired
};

export default SchemesTabs;