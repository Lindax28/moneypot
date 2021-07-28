import { userContext } from '../session/context';
import { Link } from 'react-router-dom';
import React, { useEffect, useState, useContext } from 'react';
import Axios, { AxiosResponse } from 'axios';
import config from '../../config/keys';
import ClipLoader from "react-spinners/ClipLoader";
import "./trade.css";

export default function Trade(props: any) {
  const user = useContext(userContext);
  const [buy, setBuy] = useState<number>(0);
  const [sell, setSell] = useState<number>(0);
  const [cash, setCash] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [feedback, setFeedback] = useState<boolean>(false);
  const [error, setError] = useState<string>("")
  const [click, setClick] = useState<number>(0)

  useEffect(() => {
    setLoading(true);
    Axios.get(`${config.API_URL}/api/portfolio/balance/${props.symbol}`, {withCredentials: true})
    .then((response: AxiosResponse) => {
      setLoading(false);
      setCash(response.data.cash_balance);
      setQuantity(response.data.quantity);
    }, () => {
      setLoading(false);
      setCash(0);
      setQuantity(0);
    })
    }, [click, props.symbol, quantity])

  function handleBuy() {
    setError("");
    Axios.post(`${config.API_URL}/api/stocks/trade`, {stock: props.symbol, quantity: buy}, {withCredentials: true})
    .then((response: AxiosResponse) => {
      setFeedback(true);
      setClick(click + 1);
    }, (res) => {
      setError(res.response.data.message)
    })
  }

  function handleSell() {
    setError("");
    Axios.post(`${config.API_URL}/api/stocks/trade`, {stock: props.symbol, quantity: -sell}, {withCredentials: true})
    .then((response: AxiosResponse) => {
      setFeedback(true);
      setClick(click + 1);
    }, (res) => {
      setError(res.response.data.message)
    })
  }

  function showPopup() {
    if (feedback) {
      setTimeout(() => setFeedback(false), 3000);
      return (
        <div>
          <h3>Order completed</h3>
        </div>
      )
    } else {
      return null;
    }
  }

  return (
    <div>
      {showPopup()}
      {user ? (
        <>
          <h2>Trade</h2>
          {loading ? (
            <ClipLoader />
          ) : (
            <>
              <div>Cash Available for Trading: ${cash.toLocaleString(undefined,{'minimumFractionDigits':2,'maximumFractionDigits':2})}</div>
              <div>Shares of {props.symbol.toUpperCase()} owned: {quantity}</div>
              <div>{error}</div>
              <div>
                Buy {props.symbol.toUpperCase()}
                <input type="number" placeholder="Qty" onChange={e => setBuy(parseInt(e.target.value))}/>
                <button onClick={handleBuy}>Buy</button>
              </div>
              <div>
                Sell {props.symbol.toUpperCase()}
                <input type="number" placeholder="Qty" onChange={e => setSell(parseInt(e.target.value))}/>
                <button onClick={handleSell}>Sell</button>
              </div>
            </>
          )}
        </>
      ) : (
        <Link className="login-to-trade" to="/login">Log in to begin trading!</Link>
      )}
    </div>
  )
}