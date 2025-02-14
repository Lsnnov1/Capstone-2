import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const Navbar = ({ token, setToken }) => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    setToken(null); // Clear the token in App state
    localStorage.removeItem('token'); // Remove token from local storage
    navigate('/login'); // Redirect to the login page
  };

  return (
    <nav style={styles.nav}>
      <h1 style={styles.title}>Food Fun</h1>
      <ul style={styles.navLinks}>
        <li>
          <NavLink
            to="/trivia"
            style={({ isActive }) =>
              isActive ? { ...styles.link, ...styles.activeLink } : styles.link
            }
          >
            Trivia
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/image"
            style={({ isActive }) =>
              isActive ? { ...styles.link, ...styles.activeLink } : styles.link
            }
          >
            Food Images
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/facts"
            style={({ isActive }) =>
              isActive ? { ...styles.link, ...styles.activeLink } : styles.link
            }
          >
            Fun Facts
          </NavLink>
        </li>
        {!token ? (
          <>
            <li>
              <NavLink
                to="/login"
                style={({ isActive }) =>
                  isActive ? { ...styles.link, ...styles.activeLink } : styles.link
                }
              >
                Login
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/signup"
                style={({ isActive }) =>
                  isActive ? { ...styles.link, ...styles.activeLink } : styles.link
                }
              >
                Signup
              </NavLink>
            </li>
          </>
        ) : (
          <>
            <li>
              <NavLink
                to="/profile"
                style={({ isActive }) =>
                  isActive ? { ...styles.link, ...styles.activeLink } : styles.link
                }
              >
                Profile
              </NavLink>
            </li>
            <li>
              <button onClick={handleSignOut} style={styles.link}>
                Sign Out
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: '#fa6b43',
    padding: '10px 20px',
  },
  title: {
    margin: 0,
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
  },
  navLinks: {
    listStyleType: 'none',
    display: 'flex',
    gap: '15px',
    margin: 0,
    padding: 0,
  },
  link: {
    textDecoration: 'none',
    fontSize: '18px',
    color: '#333',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
  },
  activeLink: {
    fontWeight: 'bold',
    color: '#000',
    textDecoration: 'underline',
  },
};

export default Navbar;
