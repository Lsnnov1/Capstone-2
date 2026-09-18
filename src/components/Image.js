import '../static/image.css'
import React, { useState, useEffect } from 'react';
import { getRandomFoodImage } from '../api/api';

const Image = () => {
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetching image function
  const fetchImage = async () => {
    setLoading(true);
    setError(''); // Reset error state before fetching a new image
    try {
      const img = await getRandomFoodImage();
      if (img) {
        setImage(img);
      } else {
        setError('Failed to fetch image.');
      }
    } catch (err) {
      setError('Error fetching image.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchImage(); // Fetch image when component mounts
  }, []);

  return (
    <div className="image-container">
      <h2>Random Food Image</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div>
          <div className="image-wrapper">
            <img src={image} alt="Food" className="food-image" />
          </div>
          <button onClick={fetchImage} className="load-image-button">
            Get New Image
          </button>
        </div>
      )}
    </div>
  );
};

export default Image;
