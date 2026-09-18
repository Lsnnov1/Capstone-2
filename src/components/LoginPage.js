import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const LoginPage = ({ setToken }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, { email, password });

      if (response && response.data) {
        const { token } = response.data;
        setToken(token);
        localStorage.setItem('token', token); // Store token in localStorage
        navigate('/profile'); // Redirect to profile page
      } else {
        setErrorMessage('Invalid response data');
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.error || 'Failed to log in. Please check your credentials.');
      console.error('Login Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="page page--narrow">
      <div className="card">
        <h1>Welcome back</h1>
        <p className="lede">Log in to see your profile and best score.</p>

        {errorMessage && (
          <p className="alert alert-error" role="alert">
            {errorMessage}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              className="input"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="field">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              className="input"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block" disabled={isLoading}>
            {isLoading ? 'Logging in…' : 'Log in'}
          </button>
        </form>

        <p className="form-foot">
          New here? <Link to="/signup">Create an account</Link>
        </p>
      </div>
    </main>
  );
};

export default LoginPage;
