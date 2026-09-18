import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (!email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/register`, {
        email,
        password,
        username,
      });
      setMessage(response.data.message || 'Successfully registered!');
    } catch (err) {
      setError(err.response?.data?.error || 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="page page--narrow">
      <div className="card">
        <h1>Create your account</h1>
        <p className="lede">Save your profile and track your best quiz score.</p>

        {error && (
          <p className="alert alert-error" role="alert">
            {error}
          </p>
        )}
        {message && (
          <p className="alert alert-success" role="status">
            {message} <Link to="/login">Log in</Link>
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="signup-username">Username</label>
            <input
              id="signup-username"
              className="input"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Pick a display name"
              required
            />
          </div>
          <div className="field">
            <label htmlFor="signup-email">Email</label>
            <input
              id="signup-email"
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
            <label htmlFor="signup-password">Password</label>
            <input
              id="signup-password"
              className="input"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              aria-describedby="signup-password-hint"
              required
            />
            <span id="signup-password-hint" className="field__hint">
              Use at least 6 characters.
            </span>
          </div>
          <button type="submit" className="btn btn-primary btn-block" disabled={isLoading}>
            {isLoading ? 'Creating account…' : 'Sign up'}
          </button>
        </form>

        <p className="form-foot">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </main>
  );
};

export default SignupPage;
