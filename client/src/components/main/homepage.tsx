import React, { useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { useHistory } from 'react-router-dom';
import "./homepage.css";

export default function Homepage() {
const [symbol, setSymbol] = useState<string>("")
  const history = useHistory();

  const searchStock = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (symbol !== "") {
      history.push(`/stock/${symbol}`);
    }
  }

  return (
    <div className="homepage" >
      <h1>Moneypot paper trading<br></br>Search for a stock symbol to get started </h1>
      <form className="homepage-searchbar" onSubmit={searchStock}>
        <input type="text" placeholder="Stock Symbol (ex. AAPL, MSFT, FB)" onChange={e => setSymbol(e.target.value)}></input>
        <button type="submit"><AiOutlineSearch /></button>
      </form>
    </div>
  )
}



