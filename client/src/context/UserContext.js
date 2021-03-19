import React, { createContext, useContext } from "react";
import { useAuth } from './AuthContext';

const UserContext = createContext({
  email: '',
  notifications: [],
  notificationsToken: ''
});

const UserProvider = props => {
  const { data } = useAuth();
  return <UserContext.Provider value={data ? data.user : null} {...props} />;
}

const useUser = () => useContext(UserContext);

export { UserProvider, useUser };
