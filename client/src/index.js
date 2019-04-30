import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { PublicApp } from './app/PublicApp';

ReactDOM.render((
  <BrowserRouter>
    <PublicApp />
  </BrowserRouter>
), document.getElementById('root'));
