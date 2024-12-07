import React, { useState, useEffect } from 'react';

const Fact = () => {
  const [fact, setFact] = useState('');

  useEffect(() => {
    // Random food facts array
    const facts = [
      // api call to get random fact
      'Did you know that honey never spoils?',
      'Tomatoes were once thought to be poisonous!',
      'The world’s most expensive pizza costs $12,000.',
      'Bananas are considered a berry, as a fruit is the part of a flowering plant that contains seeds.',
      'Rhubarb can be heard growing if you listen closely.',
      'Most carrots were purple in the past, but Dutch growers developed orange carrots in the late 17th century.',
      'Cheese is the most stolen food in the world.',
      'Peanuts can be used to make dynamite!',
      'Chocolate was once used as currency!', 


    ];
    setFact(facts[Math.floor(Math.random() * facts.length)]);
  }, []);

  return (
    <div className="fact-container">
      <h2>Food Facts!</h2>
      <p>{fact}</p>
    </div>
  );
};

export default Fact;
