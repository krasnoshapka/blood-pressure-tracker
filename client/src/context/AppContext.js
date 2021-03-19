import React from 'react';
import { ApolloProvider } from '@apollo/client';
import client from '../util/graphql';
import { AuthProvider } from './AuthContext';
import { UserProvider } from './UserContext';

function AppProvider({ children }) {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <UserProvider>{children}</UserProvider>
      </AuthProvider>
    </ApolloProvider>
  );
}

export default AppProvider;
