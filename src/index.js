import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faTrophy, faMedal, faUserFriends, faListOl } from '@fortawesome/free-solid-svg-icons';
library.add(faTrophy, faMedal, faUserFriends, faListOl);

ReactDOM.render(
  <App />,
  document.getElementById("root")
);