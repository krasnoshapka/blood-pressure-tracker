import React, {useContext, createContext} from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import {processErrors} from '../util/errors';

const AUTH_TOKEN = 'AuthToken';

const USER_QUERY = gql`
  {
    user {
      email
      notifications {
        id
        mon
        tue
        wed
        thu
        fri
        sat
        sun
        time
      }
    } 
  }
`

const SIGNIN_USER_MUTATION = gql`
  mutation signInUser($email:String!, $password: String!) {
    signInUser(email: $email, password:$password) 
  }
`;

const SIGNUP_USER_MUTATION = gql`
  mutation signUpUser($email: String!, $password: String!, $confirmPassword: String!) {
    signUpUser(email: $email, password: $password, confirmPassword: $confirmPassword)
  }
`;

const AuthContext = createContext({});

function AuthProvider(props) {
  const { loading, data, refetch, error } = useQuery(USER_QUERY);
  const [signInUser, {error: _signInError}] = useMutation(SIGNIN_USER_MUTATION);
  const [signUpUser, {error: _signUpError}] = useMutation(SIGNUP_USER_MUTATION);

  const signin = async (email, password) => {
    try {
      const res = await signInUser({ variables: { email, password } });
      if (res && res.data && res.data.signInUser) {
        localStorage.setItem(AUTH_TOKEN, res.data.signInUser);
        return true;
      } else {
        localStorage.removeItem(AUTH_TOKEN);
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  }

  const signup = async (email, password, confirmPassword) => {
    try {
      const res = await signUpUser({ variables: { email, password, confirmPassword } });
      if (res && res.data && res.data.signUpUser) {
        localStorage.setItem(AUTH_TOKEN, res.data.signUpUser);
        return true;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  }

  const logout = () => {
    localStorage.removeItem(AUTH_TOKEN);
  }

  return (
    <AuthContext.Provider
      value={{ loading, error, data, signin, logout, signup,
        signInError: processErrors(_signInError), signUpError: processErrors(_signUpError) }}
      {...props}
    />
  );
}

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth, AUTH_TOKEN };
