import React, { useEffect, useState } from 'react';
import Axios, { AxiosResponse } from 'axios';
import ClipLoader from "react-spinners/ClipLoader";
import StockInterface from "../../types/stock";
import Trade from './trade';
import config from '../../config/keys';

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
      <ClipLoader />
      ) : (
        stock?.symbol ? (
          <>
            <h2>{stock.name} ({stock.symbol})</h2>
            <ul>
              <li>Ticker Symbol: {stock.symbol}</li>
              <li>List Date: {stock.listdate}</li>
              <li>Stock Exchange: {stock.exchange}</li>
              <li>Volume: {stock.volume.toLocaleString()}</li>
              <li>Open: ${stock.open.toFixed(2)}</li>
              <li>Close: ${stock.close.toFixed(2)}</li>
              <li>High: ${stock.high.toFixed(2)}</li>
              <li>Low: ${stock.low.toFixed(2)}</li>
              <li>Similar Stocks: {stock.similar.join(", ")}</li>
            </ul>
            <ul>
              <li>Company Name: {stock.name}</li>
              <li>Description: {stock.description}</li>
              <li>Industry: {stock.industry}</li>
              <li>Sector: {stock.sector}</li>
              <li>Country: {stock.country}</li>
              <li>CEO: {stock.ceo}</li>
              <li>Number of Employees: {stock.employees.toLocaleString()}</li>
              <li>Market Cap: {stock.marketcap.toLocaleString()}</li>
              <li>Website: {stock.url}</li>

            </ul>
          </>
        ) : (
          <>
            <p>
              No stock symbol matched search: {props.match.params.symbol}
            </p>
            <ul>
              Check out some commonly searched stocks:
              <li>AAPL</li>
              <li>MSFT</li>
              <li>AMZN</li>
              <li>GOOG</li>
              <li>FB</li>
              <li>TSLA</li>
            </ul>
          </>
        )
      )}
      <Trade />
    </div>
  )
}