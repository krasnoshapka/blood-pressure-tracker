import React, {useContext, createContext} from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';

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
  mutation loginUser($email:String!, $password: String!) {
    loginUser(email: $email, password:$password) 
  }
`;

const SIGNUP_USER_MUTATION = gql`
  mutation loginUser($email:String!, $password: String!) {
    loginUser(email: $email, password:$password) 
  }
`;

const AuthContext = createContext({});

function AuthProvider(props) {
  const { loading, data, refetch, error } = useQuery(USER_QUERY);
  const [loginUser, {error: signinError}] = useMutation(SIGNIN_USER_MUTATION);
  const [signupUser] = useMutation(SIGNUP_USER_MUTATION);

  const signin = async (email, password) => {
    const res = await loginUser({ variables: { email, password } });
    if (res && res.data && res.data.loginUser) {
      localStorage.setItem(AUTH_TOKEN, res.data.loginUser);
      // await refetch();
    } else {
      throw Error('No token returned');
    }
    return res;
  }

  const signup = (email, password) => {
    // return signup({ variables: { name, email, password } }).then(res => {
    //   if (res && res.data && res.data.login && res.data.login.token) {
    //     const { token } = res.data.login
    //     localStorage.setItem(AUTH_TOKEN, token)
    //     refetch()
    //   } else {
    //     throw Error('No token returned')
    //   }
    //   return res
    // })
  }

  const logout = () => {
    localStorage.removeItem(AUTH_TOKEN);
    // await refetch();
    // props.history.push(SIGNIN_ROUTE);
  }

  return (
    <AuthContext.Provider
      value={{ loading, error, data, signin, signinError, logout, signup }}
      {...props}
    />
  );
}

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth, AUTH_TOKEN };
