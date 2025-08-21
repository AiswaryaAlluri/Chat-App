import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { store } from './App';

const Nav = () => {
  const [token, setToken] = useContext(store);

  return (
    <div>
      {!token ? (
        // For logged-out users
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <a className="navbar-brand" href="#">Navbar</a>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto"></ul>
            <form className="form-inline my-2 my-lg-0">
              <ul>
                <Link to="/register"><li>Register</li></Link>
                <Link to="/login"><li>Login</li></Link>
              </ul>
            </form>
          </div>
        </nav>
      ) : (
        // For logged-in users
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <a className="navbar-brand" href="#">Dashboard</a>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto"></ul>
            <form className="form-inline my-2 my-lg-0">
              <ul>
                <Link to="/myprofile"><li>My Profile</li></Link>
                <Link to="/messages"><li>Messages</li></Link>
                <li onClick={() => setToken(null)}>Logout</li>
              </ul>
            </form>
          </div>
        </nav>
      )}
    </div>
  );
};

export default Nav;
