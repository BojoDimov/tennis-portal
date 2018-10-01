import React from 'react';

import Navigation from '../menu/Navigation';
import Editions from '../editions';
import Schemes from '../schemes';

class Home extends React.Component {

  render() {
    return (
      <React.Fragment>
        <Editions />
        <Schemes />
      </React.Fragment>
    );
  }
}

export default Home;