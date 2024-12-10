import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 

const LoginPage = ({ setToken }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('http://localhost:5000/api/login', { email, password });
      
      // Ensure that the response contains the expected data
      if (response && response.data) {
        const { token } = response.data;
        setToken(token);
        localStorage.setItem('token', token); // Optionally store token in localStorage
        navigate('/profile'); // Redirect to profile page using useNavigate
      } else {
        setErrorMessage('Invalid response data');
      }
    } catch (error) {
      setErrorMessage('Failed to log in. Please check your credentials.');
      console.error('Login Error:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          placeholder="Email" 
        />
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          placeholder="Password" 
        />
        <button type="submit">Login</button>
      </form>
      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
};

export default LoginPage;
