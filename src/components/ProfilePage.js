import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProfilePage = ({ token, setToken }) => {
  const [user, setUser] = useState({});
  const [highestScore, setHighestScore] = useState(0);
  const [newName, setNewName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://localhost:5000/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Token:', token);
        setUser(response.data.user);
        setHighestScore(response.data.highestScore);
      } catch (err) {
        setError('Failed to fetch profile');
      }
    };

    if (token) {
      fetchProfile();
    }
  }, [token]);

  const handleNameChange = async () => {
    try {
      const response = await axios.put(
        'http://localhost:5000/auth/profile',
        { name: newName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(response.data.user);
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  return (
    <div>
      <h2>Profile</h2>
      {error && <p>{error}</p>}
      <p>Name: {user.username}</p>
      <p>Email: {user.email}</p>
      <p>Highest Quiz Score: {highestScore}</p>

      <input
        type="text"
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
        placeholder="New name"
      />
      <button onClick={handleNameChange}>Update Name</button>


    </div>
  );
};

export default ProfilePage;
