import React from 'react';
import { hot } from 'react-hot-loader';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

export default hot(module)(() => {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
});

