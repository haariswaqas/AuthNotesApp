import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { authState, dispatch } = useAuth();
  const navigate = useNavigate();

  // Handle logout functionality
  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' }); // Dispatch the logout action
    navigate('/'); // Redirect to the home page
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-6">Welcome to the Authentication System</h1>
      {!authState.isAuthenticated ? (
        <div className="space-x-4">
          <Link
            to="/login"
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold transition duration-200"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white font-semibold transition duration-200"
          >
            Register
          </Link>
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-4">
          <p className="text-lg">
            Logged in as: <span className="font-semibold">{authState.user?.email || 'No Email'}</span>
          </p>
          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white font-semibold transition duration-200"
          >
            Logout
          </button>
          <Link
            to="/notes"
            className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white font-semibold transition duration-200"
          >
            View All Notes
          </Link>
          <Link
            to="/add-note"
            className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white font-semibold transition duration-200"
          >
            Add Note
          </Link>
        </div>
      )}
    </div>
  );
};

export default Home;
