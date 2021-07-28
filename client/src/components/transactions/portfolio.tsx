import { useEffect, useState } from 'react';
import Axios, { AxiosResponse } from 'axios';
import config from '../../config/keys';
import ClipLoader from "react-spinners/ClipLoader";

export default function Portfolio() {
  const [cash, setCash] = useState<number>(0);
  const [shares, setShares] = useState<any>({});
  const [price, setPrice] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    Axios.get(`${config.API_URL}/api/portfolio/shares`, {withCredentials: true})
    .then((response: AxiosResponse) => {
      setShares(response.data.shares);
      setCash(response.data.cash_balance);
      setPrice(response.data.price);
      setLoading(false);
    }, () => {
      setLoading(false);
    })
    }, [])

  function toCurrency(amount: number) {
    return amount.toLocaleString(undefined,{'minimumFractionDigits':2,'maximumFractionDigits':2})
  }

  function stockValue() {
    let stocks = Object.keys(shares);
    let total = 0;
    stocks.forEach(stock => {
      total += (shares[stock] * price[stock]);
    })
    return total;
  }

  return (
    <div>
      <h1>Portfolio</h1>
      {loading ? (
        <ClipLoader />
      ) : (
        <>
          <ul>
            <li>Portfolio Value: ${toCurrency(stockValue() + cash)}</li>
            <li>Stock Value: ${toCurrency(stockValue())}</li>
            <li>Cash Balance: ${toCurrency(cash)}</li>
          </ul>
          <h3>Investments</h3>
          <ul>
            {Object.keys(shares).map((stock:string, idx) => (
              shares[stock] > 0 ? (
                <li key={idx}>
                  <div>{stock}</div>
                  <div>{shares[stock]}</div>
                  <div>${toCurrency(price[stock])}</div>
                </li>
              ) : (<div key={idx}></div>)
            ))}
          </ul>
        </>
      )}
    </div>
  )
}