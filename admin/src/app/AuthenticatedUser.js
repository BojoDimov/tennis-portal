import React from 'react';

const AuthenticatedUserContext = React.createContext({
  token: null,
  logout: () => { }
});

export const ProvideAuthenticatedUser = AuthenticatedUserContext.Provider;
export const AuthenticatedUser = AuthenticatedUserContext.Consumer;