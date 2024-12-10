import './static/App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Quiz from './components/Quiz';
import Image from './components/image';
import Fact from './components/Fact';
import SignupPage from './components/SignupPage';
import LoginPage from './components/LoginPage'; 
import ProfilePage from './components/ProfilePage';
 

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token')); // Track the auth token

  return (
    <Router>
      <Navbar token={token} />
      <Routes>
        <Route path="/trivia" element={<Quiz />} />
        <Route path="/image" element={<Image />} />
        <Route path="/facts" element={<Fact />} />
        
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage setToken={setToken} />} />
        
        {/* Protect the Profile Page route */}
        <Route
          path="/profile"
          element={token ? <ProfilePage token={token} /> : <Navigate to="/login" />}
        />

        {/* Default Route */}
        <Route
          path="*"
          element={<div style={{ padding: '20px' }}>Welcome to Food Fun!</div>}
        />
      </Routes>
    </Router>
  );
};

export default App;
