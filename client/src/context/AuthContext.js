import React, {useContext, createContext} from 'react';
import { useMutation, gql } from '@apollo/client';
import {processErrors} from '../util/errors';

const AUTH_TOKEN = 'AuthToken';

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
  const [signInUser, {error: _signInError, loading: _signInLoading}] = useMutation(SIGNIN_USER_MUTATION);
  const [signUpUser, {error: _signUpError, loading: _signUpLoading}] = useMutation(SIGNUP_USER_MUTATION);

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
      value={{ signin, logout, signup, loading: _signInLoading || _signUpLoading,
        errors: processErrors(_signInError) || processErrors(_signUpError) }}
      {...props}
    />
  );
}

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth, AUTH_TOKEN };
