import '../static/image.css'
import React, { useState, useEffect, useCallback } from 'react';
import { getRandomFoodImage } from '../api/api';

const Image = () => {
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetching image function
  const fetchImage = useCallback(async () => {
    setLoading(true);
    setError(''); // Reset error state before fetching a new image
    try {
      const img = await getRandomFoodImage();
      if (img) {
        setImage(img);
      } else {
        setError("We couldn't fetch a food image right now.");
      }
    } catch (err) {
      setError("We couldn't fetch a food image right now.");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchImage(); // Fetch image when component mounts
  }, [fetchImage]);

  return (
    <main className="page">
      <div className="page-head">
        <h1>Random Food Image</h1>
        <p className="lede">A new dish every time. See something you'd eat?</p>
      </div>

      <figure className="image-card">
        {loading ? (
          <div className="image-card__frame skeleton" aria-busy="true">
            <span className="sr-only">Loading image…</span>
          </div>
        ) : error ? (
          <div className="image-card__frame state" role="alert">
            <div className="state__icon" aria-hidden="true">
              🍽️
            </div>
            <p>{error}</p>
          </div>
        ) : (
          <div className="image-card__frame">
            <img src={image} alt="A random dish" className="food-image" />
          </div>
        )}
      </figure>

      <div className="centered-actions">
        <button type="button" onClick={fetchImage} className="btn btn-primary" disabled={loading}>
          {error ? 'Try again' : 'Get new image'}
        </button>
      </div>
    </main>
  );
};

export default Image;
