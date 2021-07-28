import React, { useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { useHistory } from 'react-router-dom';
import "./navbar.css";

export default function Searchbar() {
  const [symbol, setSymbol] = useState<string>("")
  const history = useHistory();

  const searchStock = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (symbol !== "") {
      history.push(`/stock/${symbol}`);
    }
  }

  return (
    <form className="navbar-searchbar" onSubmit={searchStock}>
      <input type="text" placeholder="Stock Symbol" onChange={e => setSymbol(e.target.value)}></input>
      <button type="submit"><AiOutlineSearch /></button>
    </form>
  )
}