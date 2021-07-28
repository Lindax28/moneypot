import React, { useContext } from 'react';
import Axios from 'axios';
import { Link } from 'react-router-dom';
import "./navbar.css";
import { userContext } from '../session/context';
import Searchbar from './searchbar';
import Logo from '../../images/moneypot_logo.jpg';
import Moneypot from '../../images/moneypot_name.jpg';
import config from '../../config/keys';

export default function Navbar() {
  const user = useContext(userContext);

  const logout = () => {
    Axios.get(`${config.API_URL}/logout`, {
      withCredentials: true
    }).then(res => {
      if (res.data === "success") {
        window.location.href = "/";
      }
    })
  }

  return (
    <div className="navbar-container">
      <div className="navbar-logo">
        <Link to="/"><img className="moneypot-logo" src={Logo} alt="Moneypot Logo"/></Link>
        <Link to="/"><img className="moneypot-name" src={Moneypot} alt="Moneypot Name"/></Link>
      </div>
      <div className="navbar-items">
        <div className="navbar-links">
          <Link to="/">Home</Link>
          {user ? (
            <>
              <Link to="/portfolio">Portfolio</Link>
              <Link onClick={logout} to="/logout">Logout</Link>
            </>
          ) : (
            <>
              <Link to="/register">Sign Up</Link>
              <Link to="/login">Sign In</Link>
            </>
          )}
        </div>
        <Searchbar />
      </div>
    </div>
  )
}