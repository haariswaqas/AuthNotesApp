import { createContext, useContext, useReducer, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';

// Create AuthContext
const AuthContext = createContext();

const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
  isLoading: true // Ensure loading is true initially
};

// Reducer function
const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      const decodedToken = jwtDecode(action.payload.token);
      console.log("Decoded token:", decodedToken); // Log the token for debugging
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        isAuthenticated: true,
        token: action.payload.token,
        user: decodedToken, // Set the entire decoded token as user
        isLoading: false,
      };
    
    
    
    case 'LOGOUT':
      localStorage.removeItem('token'); // Remove token from local storage
      return {
        ...state,
        isAuthenticated: false,
        token: null,
        user: null,
        isLoading: false // Set to false after logging out
      };
    case 'SET_LOADING':
      return { ...state, isLoading: true }; // When rechecking token
    case 'FINISH_LOADING':
      return { ...state, isLoading: false }; // Done loading without changing auth state
    default:
      return state;
  }
};

// AuthProvider component
const AuthProvider = ({ children }) => {
  const [authState, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const tokenFromStorage = localStorage.getItem('token');

    if (tokenFromStorage) {
      try {
        const decodedToken = jwtDecode(tokenFromStorage);
        if (decodedToken.exp * 1000 < Date.now()) {
          dispatch({ type: 'LOGOUT' });
        } else {
          dispatch({ type: 'LOGIN', payload: { token: tokenFromStorage } });
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        dispatch({ type: 'LOGOUT' });
      }
    } else {
      dispatch({ type: 'FINISH_LOADING' });
    }
    
  }, []);
  
  // Define the login function
  const login = async (token) => {
    try {
      dispatch({ type: 'LOGIN', payload: { token } });
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <AuthContext.Provider value={{ authState, login, dispatch }}>
      {!authState.isLoading && children} {/* Render children only when not loading */}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth };
