import React from 'react';

class MenuContext {
  constructor() {
    const { Provider, Consumer } = React.createContext(0);
    this.SetCurrentRoute = Provider;
    this.WithCurrentRoute = Consumer;
  }
}

export default new MenuContext();