import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { App } from './app/App';
import { PublicApp } from './theme_impl/PublicApp';

ReactDOM.render((
  <BrowserRouter>
    <PublicApp />
  </BrowserRouter>
), document.getElementById('root'));