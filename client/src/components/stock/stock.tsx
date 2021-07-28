import { useEffect, useState } from 'react';
import Axios, { AxiosResponse } from 'axios';
import ClipLoader from "react-spinners/ClipLoader";
import StockInterface from "../../types/stock";
import Trade from './trade';
import { Link } from 'react-router-dom';
import config from '../../config/keys';
import "./stock.css";

export default function Stock(props: any) {
  const [stock, setStock] = useState<StockInterface>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    Axios.get(`${config.API_URL}/api/stocks/${props.match.params.symbol}`, {withCredentials: true})
    .then((response: AxiosResponse) => {
      setLoading(false);
      setStock(response.data);
    }, () => {
      setLoading(false);
      setStock({
        symbol: "", 
        volume: 0, 
        open: 0, 
        close: 0, 
        high: 0, 
        low: 0,
        listdate: "",
        industry: "",
        sector: "",
        country: "",
        marketcap: 0,
        employees: 0,
        ceo: "",
        url: "",
        description: "",
        exchange: "",
        name: "",
        similar: []
      })
    })
  }, [props.match.params.symbol])

  return (
    <div>
      {loading ? (
        <div className="spinner">
          <ClipLoader />
        </div>
      ) : (
        stock?.symbol ? (
          <section className="stock-container">
            <h2>{stock.name} ({stock.symbol})</h2>
            <hr></hr>
            <div className="stock-info">
              <ul>
                <li><span className="bold">Ticker Symbol:</span> {stock.symbol}</li>
                <li><span className="bold">List Date:</span> {stock.listdate}</li>
                <li><span className="bold">Stock Exchange:</span> {stock.exchange}</li>
                <li><span className="bold">Volume:</span> {stock.volume.toLocaleString()}</li>
                <li><span className="bold">Open:</span> ${stock.open.toFixed(2)}</li>
                <li><span className="bold">Close:</span> ${stock.close.toFixed(2)}</li>
                <li><span className="bold">High:</span> ${stock.high.toFixed(2)}</li>
                <li><span className="bold">Low:</span> ${stock.low.toFixed(2)}</li>
                <li><span className="bold">Similar Stocks:</span> {stock.similar.join(", ")}</li>
              </ul>
              <ul>
                <li><span className="bold">Company Name:</span> {stock.name}</li>
                <li><span className="bold">Description:</span> {stock.description}</li>
                <li><span className="bold">Industry:</span> {stock.industry}</li>
                <li><span className="bold">Sector:</span> {stock.sector}</li>
                <li><span className="bold">Country:</span> {stock.country}</li>
                <li><span className="bold">CEO:</span> {stock.ceo}</li>
                <li><span className="bold">Number of Employees:</span> {stock.employees.toLocaleString()}</li>
                <li><span className="bold">Market Cap:</span> {stock.marketcap.toLocaleString()}</li>
                <li><span className="bold">Website:</span> {stock.url}</li>
              </ul>
            </div>
              <Trade symbol={props.match.params.symbol}/>
          </section>
        ) : (
          <section className="stock-container no-match-container">
            <p>
              No stock symbol matched your search: <span className="bold">{props.match.params.symbol}</span>
            </p>
            <ul className="common-stocks">
              Check out some commonly searched stocks:
              <li><Link to="/stock/aapl">AAPL</Link></li>
              <li><Link to="/stock/msft">MSFT</Link></li>
              <li><Link to="/stock/amzn">AMZN</Link></li>
              <li><Link to="/stock/goog">GOOG</Link></li>
              <li><Link to="/stock/fb">FB</Link></li>
              <li><Link to="/stock/tsla">TSLA</Link></li>
            </ul>
          </section>
        )
      )}
    </div>
  )
}