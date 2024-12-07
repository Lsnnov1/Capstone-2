import './static/App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React from 'react';
import Navbar from './components/Navbar';
import Quiz from './components/Quiz';
import Image from './components/image';
import Fact from './components/Fact';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/trivia" element={<Quiz />} /> {/* No need for apiKey prop */}
        <Route path="/image" element={<Image />} />
        <Route path="/facts" element={<Fact />} />
        <Route
          path="*"
          element={<div style={{ padding: '20px' }}>Welcome to Food Fun!</div>}
        />
      </Routes>
    </Router>
  );
};

export default App;
