import React from 'react';
import { Link } from 'react-router-dom';

const tiles = [
  { to: '/trivia', icon: '🧠', title: 'Food Trivia', text: 'Answer questions and keep your score.' },
  { to: '/image', icon: '🍜', title: 'Food Images', text: 'Get a random dish to drool over.' },
  { to: '/facts', icon: '💡', title: 'Fun Facts', text: 'Learn something odd about what you eat.' },
];

const Home = ({ token }) => (
  <main className="page">
    <section className="hero">
      <p className="eyebrow">Trivia · Dishes · Facts</p>
      <h1>How well do you know your food?</h1>
      <p className="hero__lede">
        Test yourself with food trivia, browse random dishes, and pick up a fun fact or two.
      </p>
      <div className="hero__cta">
        <Link className="btn btn-primary" to="/trivia">
          Start the quiz
        </Link>
        {!token && (
          <Link className="btn btn-ghost" to="/signup">
            Create an account
          </Link>
        )}
      </div>
    </section>

    <section className="tiles" aria-label="What you can do">
      {tiles.map((tile) => (
        <Link key={tile.to} to={tile.to} className="tile">
          <span className="tile__icon" aria-hidden="true">
            {tile.icon}
          </span>
          <h2>{tile.title}</h2>
          <p>{tile.text}</p>
        </Link>
      ))}
    </section>
  </main>
);

export default Home;
