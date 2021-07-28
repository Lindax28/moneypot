import { userContext } from '../session/context';
import { Link } from 'react-router-dom';
import React, { useEffect, useState, useContext } from 'react';
import Axios, { AxiosResponse } from 'axios';
import config from '../../config/keys';
import ClipLoader from "react-spinners/ClipLoader";

export default function Portfolio() {
  const user = useContext(userContext);
  const [cash, setCash] = useState<number>(0);
  const [shares, setShares] = useState<any>({});
  const [price, setPrice] = useState<any>({});
  const [quantity, setQuantity] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    Axios.get(`${config.API_URL}/api/portfolio/shares`, {withCredentials: true})
    .then((response: AxiosResponse) => {
      setLoading(false);
      setShares(response.data.shares);
      setCash(response.data.cash_balance);
      setPrice(response.data.price);
    }, () => {
      setLoading(false);
    })
    }, [])

  return (
    <div>
      <h1>Portfolio</h1>
      <ul>
        <li>Portfolio Value: </li>
        <li>Stock Value: </li>
        <li>Cash Balance: ${cash.toLocaleString(undefined,{'minimumFractionDigits':2,'maximumFractionDigits':2})}</li>
      </ul>
      <h3>Investments</h3>
      <ul>
        {Object.keys(shares).map((stock:string, idx) => (
          shares[stock] > 0 ? (
            <li key={idx}>
              <div>{stock}</div>
              <div>{shares[stock]}</div>
              <div>{price[stock]}</div>
            </li>
          ) : (<></>)
        ))}
      </ul>
    </div>
  )
}