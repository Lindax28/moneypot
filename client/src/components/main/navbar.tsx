import React, { useContext } from 'react';
import Axios from 'axios';
import { Link } from 'react-router-dom';
import "./navbar.css";
import { userContext } from '../session/context';
import Searchbar from './searchbar';

export default function Navbar() {
  const user = useContext(userContext);

  const logout = () => {
    Axios.get("http://localhost:3000/logout", {
      withCredentials: true
    }).then(res => {
      if (res.data === "success") {
        window.location.href = "/";
      }
    })
  }

  return (
    <div>
      <Link to="/">Home</Link>
      <Searchbar />
      {user ? (
        <>
          <Link to="/history">History</Link>
          <Link onClick={logout} to="/logout">Logout</Link>
        </>
      ) : (
        <>
          <Link to="/register">Sign Up</Link>
          <Link to="/login">Login</Link>
        </>
      )}
    </div>
  )
}