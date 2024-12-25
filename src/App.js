import './static/App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Quiz from './components/Quiz';
import Image from './components/Image';
import Fact from './components/Fact';
import SignupPage from './components/SignupPage';
import LoginPage from './components/LoginPage';
import ProfilePage from './components/ProfilePage';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Persist token in localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  return (
    <Router>
      <Navbar token={token} setToken={setToken} />
      <Routes>
        <Route path="/trivia" element={<Quiz />} />
        <Route path="/image" element={<Image />} />
        <Route path="/facts" element={<Fact />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage setToken={setToken} />} />
        <Route
          path="/profile"
          element={token ? <ProfilePage token={token} /> : <Navigate to="/login" />}
        />
        <Route
          path="*"
          element={<div style={{ padding: '20px', textAlign: 'center' }}><h1>Welcome to Food Fun!</h1></div>}
        />
      </Routes>
    </Router>
  );
};

export default App;
