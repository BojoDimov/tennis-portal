import React, { Component } from 'react';
import { Admin } from '../admin/Admin';
import { Menu } from '../menu/Menu';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Menu defaultState="/tournaments" />
        <Admin />
      </div>
    );
  }
}

export default App;
