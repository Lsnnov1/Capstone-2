import '../static/image.css';
import React, { useState } from 'react';

// Random food facts array
const facts = [
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

// Pick a random fact, avoiding an immediate repeat of the current one
const pickFact = (current) => {
  const choices = facts.filter((fact) => fact !== current);
  return choices[Math.floor(Math.random() * choices.length)];
};

const Fact = () => {
  const [fact, setFact] = useState(() => pickFact());

  return (
    <main className="page">
      <div className="page-head">
        <h1>Food Facts</h1>
        <p className="lede">Small bites of trivia to share at dinner.</p>
      </div>

      <blockquote className="fact-card" style={{ marginInline: 0 }}>
        <p aria-live="polite">{fact}</p>
      </blockquote>

      <div className="centered-actions">
        <button type="button" className="btn btn-primary" onClick={() => setFact(pickFact(fact))}>
          Another fact
        </button>
      </div>
    </main>
  );
};

export default Fact;
