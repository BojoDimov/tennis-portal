import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faTrophy } from '@fortawesome/free-solid-svg-icons';
library.add(faTrophy)

ReactDOM.render(
  <App />,
  document.getElementById("root")
);