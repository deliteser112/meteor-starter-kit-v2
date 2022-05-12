import { useTracker } from 'meteor/react-meteor-data';
import React, { createContext, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
// utils
// import axios from '../utils/axios';
// import { isValidToken, setSession } from '../utils/jwt';

// ----------------------------------------------------------------------

const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null
};

const handlers = {
  INITIALIZE: (state, action) => {
    const { isAuthenticated, user } = action.payload;
    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user
    };
  },
  LOGIN: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user
    };
  },
  LOGOUT: (state) => ({
    ...state,
    isAuthenticated: false,
    user: null
  }),
  REGISTER: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user
    };
  }
};

const reducer = (state, action) => (handlers[action.type] ? handlers[action.type](state, action) : state);

const AuthContext = createContext({
  ...initialState,
  method: 'jwt',
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve()
});

AuthProvider.propTypes = {
  children: PropTypes.node
};

function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { isLoading, user } = useTracker(() => {
    const handler = Meteor.subscribe('app');

    let user = {};
    
    const userInfo = Meteor.user();

    const isUser = userInfo && userInfo.profile && userInfo.profile.name;

    if (!handler.ready() || !isUser) {
      return { isLoading: true };
    }

    if (isUser) user = userInfo;

    return { isLoading: false, user };
  });

  useEffect(() => {
    const initialize = async () => {
      try {
        const accessToken = window.localStorage.getItem('Meteor.userId');
        if (accessToken) {
          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: true,
              user
            }
          });
        } else {
          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: false,
              user: null
            }
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: 'INITIALIZE',
          payload: {
            isAuthenticated: false,
            user: null
          }
        });
      }
    };

    initialize();
  }, [isLoading]);

  const login = async (email, password) => {
    // const response = await axios.post('/api/auth/login', {
    //   email,
    //   password
    // });
    const response = { user: 'success' };

    const { user } = response.data;

    // setSession(accessToken);
    dispatch({
      type: 'LOGIN',
      payload: {
        user
      }
    });
  };

  const register = async (email, password, firstname, lastname) => {
    // const response = await axios.post('/api/auth/register', {
    //   email,
    //   password,
    //   firstname,
    //   lastname
    // });
    const response = { user: 'success' };

    const { user } = response.data;

    // window.localStorage.setItem('accessToken', accessToken);
    // setSession(accessToken);
    dispatch({
      type: 'REGISTER',
      payload: {
        user
      }
    });
  };

  const logout = async () => {
    // setSession(null);
    dispatch({ type: 'LOGOUT' });
  };

  const resetPassword = () => {};

  const updateProfile = () => {};

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'jwt',
        login,
        logout,
        register
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
