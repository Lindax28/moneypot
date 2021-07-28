import { userContext } from '../session/context';
import { Link } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
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
    if (buy > 0) {
      Axios.post(`${config.API_URL}/api/stocks/trade`, {stock: props.symbol, quantity: buy}, {withCredentials: true})
      .then((response: AxiosResponse) => {
        setFeedback(true);
        setClick(click + 1);
        setBuy(0);
      }, (res) => {
        setError(res.response.data.message)
      })
    }
  }

  function handleSell() {
    setError("");
    if (sell > 0) {
      Axios.post(`${config.API_URL}/api/stocks/trade`, {stock: props.symbol, quantity: -sell}, {withCredentials: true})
      .then((response: AxiosResponse) => {
        setFeedback(true);
        setClick(click + 1);
        setSell(0);
      }, (res) => {
        setError(res.response.data.message)
      })
    }
  }

  function showPopup() {
    if (feedback) {
      setTimeout(() => setFeedback(false), 3000);
      return (
        <div className="trade-popup">
          <h3>Order completed!</h3>
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
        <section className="trade-container">
          <h2>Trade</h2>
          {loading ? (
            <ClipLoader />
          ) : (
            <>
              <div className="trade-info">
                <div>Cash Available for Trading: <span className="bold">${cash.toLocaleString(undefined,{'minimumFractionDigits':2,'maximumFractionDigits':2})}</span></div>
                <div>Shares of {props.symbol.toUpperCase()} owned: <span className="bold">{quantity}</span></div>
              </div>
              <div className="error">{error}</div>
              <div className="trade-input">
                <div className="buy-input">
                  <input type="number" min="0" placeholder="Qty" onChange={e => setBuy(parseInt(e.target.value))}/>
                  <button onClick={handleBuy}>Buy <span className="bold">{props.symbol.toUpperCase()}</span></button>
                </div>
                <div className="sell-input">
                  <input type="number" min="0" placeholder="Qty" onChange={e => setSell(parseInt(e.target.value))}/>
                  <button onClick={handleSell}>Sell <span className="bold">{props.symbol.toUpperCase()}</span></button>
                </div>
              </div>
            </>
          )}
        </section>
      ) : (
        <Link className="login-to-trade" to="/login"><span>Log in to begin trading!</span></Link>
      )}
    </div>
  )
}