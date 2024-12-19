import React from 'react';
import { useNavigate } from 'react-router-dom';

const Signout = ({ setToken }) => {
  const navigate = useNavigate();

  const handleSignout = () => {
    // Clear token from state and localStorage
    setToken(null);
    localStorage.removeItem('token');

    // Redirect to login page
    navigate('/login');
  };

  return (
    <button onClick={handleSignout}>
      Sign Out
    </button>
  );
};

export default Signout;
