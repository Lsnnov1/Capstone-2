import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProfilePage = ({ token }) => {
  const [user, setUser] = useState({});
  const [highestScore, setHighestScore] = useState(0);
  const [newName, setNewName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data.user);
        setHighestScore(response.data.highestScore ?? 0);
      } catch (err) {
        setError('Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchProfile();
    }
  }, [token]);

  const handleNameChange = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setError('');
    setSaving(true);
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/auth/profile`,
        { name: newName.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(response.data.user);
      setNewName('');
    } catch (err) {
      setError('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const initial = (user.username || user.email || '?').charAt(0).toUpperCase();

  return (
    <main className="page page--narrow">
      <div className="card profile">
        {error && (
          <p className="alert alert-error" role="alert">
            {error}
          </p>
        )}

        {loading ? (
          <div aria-busy="true">
            <div className="skeleton" style={{ width: 72, height: 72, borderRadius: '50%', marginBottom: 16 }} />
            <div className="skeleton" style={{ width: '60%', height: 32, marginBottom: 12 }} />
            <div className="skeleton" style={{ width: '40%', height: 18 }} />
            <span className="sr-only">Loading profile…</span>
          </div>
        ) : (
          <>
            <div className="avatar" aria-hidden="true">
              {initial}
            </div>
            <h1>{user.username || 'Your profile'}</h1>
            <p className="muted">{user.email}</p>

            <dl className="stat">
              <dt>Highest quiz score</dt>
              <dd>{highestScore}</dd>
            </dl>

            <form className="profile__form" onSubmit={handleNameChange}>
              <div className="field">
                <label htmlFor="new-name">Change your display name</label>
                <div className="profile__row">
                  <input
                    id="new-name"
                    className="input"
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="New name"
                  />
                  <button type="submit" className="btn btn-primary" disabled={saving || !newName.trim()}>
                    {saving ? 'Saving…' : 'Update name'}
                  </button>
                </div>
              </div>
            </form>
          </>
        )}
      </div>
    </main>
  );
};

export default ProfilePage;
