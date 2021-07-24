import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import "./navbar.css";
import { userContext } from '../session/context';

export default function Navbar() {
  const user = useContext(userContext);
  return (
    <div>
      <Link to="/">Home</Link>
      {user ? (
        <>
          <Link to="/history">History</Link>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
        </>
      )}
    </div>
  )
}