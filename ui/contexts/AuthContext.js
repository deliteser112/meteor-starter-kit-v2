import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import React, { createContext, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';

// ----------------------------------------------------------------------

const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
};

const handlers = {
  INITIALIZE: (state, action) => {
    const { isAuthenticated, user } = action.payload;
    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user,
    };
  },
};

const reducer = (state, action) =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

const AuthContext = createContext({
  ...initialState,
});

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
              user,
            },
          });
        } else {
          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: false,
              user: null,
            },
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: 'INITIALIZE',
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    };

    initialize();
  }, [isLoading]);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'jwt',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export { AuthContext, AuthProvider };
