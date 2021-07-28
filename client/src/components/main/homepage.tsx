import React, { useEffect, useState, useContext } from 'react';
import { userContext } from '../session/context';
import { AiOutlineSearch } from 'react-icons/ai';
import { useHistory } from 'react-router-dom';
import Axios, { AxiosResponse } from 'axios';
import config from '../../config/keys';
import "./homepage.css";

export default function Homepage() {
  const user = useContext(userContext);
  const [symbol, setSymbol] = useState<string>("");
  const [name, setName] = useState<string>("");
  const history = useHistory();

  useEffect(() => {
    Axios.get(`${config.API_URL}/name`, {withCredentials: true})
    .then((response: AxiosResponse) => {
      setName(response.data.name);
    })
    }, [])

  const searchStock = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (symbol !== "") {
      history.push(`/stock/${symbol}`);
    }
  }

  return (
    <div className="homepage" >
      <div className="homepage-content">
        {user ? (
          <h1>Hi, {name}!<br></br>Search for a stock symbol to get started </h1>
        ) : (
          <h1>Moneypot paper trading<br></br>Search for a stock symbol to get started </h1>
        )}
        <form className="homepage-searchbar" onSubmit={searchStock}>
          <input type="text" placeholder="Stock Symbol (ex. AAPL, MSFT)" onChange={e => setSymbol(e.target.value)}></input>
          <button type="submit"><AiOutlineSearch /></button>
        </form>
      </div>
    </div>
  )
}



