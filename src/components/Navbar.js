import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

const Navbar = ({ token, setToken }) => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    setToken(null); // Clear the token in App state
    localStorage.removeItem('token'); // Remove token from local storage
    navigate('/login'); // Redirect to the login page
  };

  const linkClass = ({ isActive }) => (isActive ? 'nav__link active' : 'nav__link');

  return (
    <header className="nav">
      <nav className="nav__inner" aria-label="Main">
        <Link to="/" className="brand">
          <span className="brand__dot" aria-hidden="true" />
          Food Fun
        </Link>
        <ul className="nav__links">
          <li>
            <NavLink to="/trivia" className={linkClass}>
              Trivia
            </NavLink>
          </li>
          <li>
            <NavLink to="/image" className={linkClass}>
              Images
            </NavLink>
          </li>
          <li>
            <NavLink to="/facts" className={linkClass}>
              Facts
            </NavLink>
          </li>
          {!token ? (
            <>
              <li>
                <NavLink to="/login" className={linkClass}>
                  Login
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/signup"
                  className={({ isActive }) =>
                    isActive ? 'nav__link nav__link--cta active' : 'nav__link nav__link--cta'
                  }
                >
                  Sign up
                </NavLink>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink to="/profile" className={linkClass}>
                  Profile
                </NavLink>
              </li>
              <li>
                <button type="button" onClick={handleSignOut} className="nav__link">
                  Sign out
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
