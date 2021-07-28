import { useEffect, useState } from 'react';
import Axios, { AxiosResponse } from 'axios';
import config from '../../config/keys';
import ClipLoader from "react-spinners/ClipLoader";
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import "./portolio.css";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

function createData(stock:string, shares:number, price:number) {
  return { stock, shares, price };
}

export default function Portfolio() {
  const classes = useStyles();
  const [cash, setCash] = useState<number>(0);
  const [shares, setShares] = useState<any>({});
  const [price, setPrice] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [rows, setRows] = useState<any>([]);

  useEffect(() => {
    setLoading(true);
    Axios.get(`${config.API_URL}/api/portfolio/shares`, {withCredentials: true})
    .then((response: AxiosResponse) => {
      setShares(response.data.shares);
      setCash(response.data.cash_balance);
      setPrice(response.data.price);
      let stockList = Object.keys(response.data.shares);
      let currStock;
      let list = [];
      for (let i = 0; i < stockList.length; i++) {
        currStock = stockList[i];
        if (shares[currStock] > 0) {
          list.push(createData(currStock, shares[currStock], price[currStock]));
        }
      }
      setRows(list);
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
    <div className="portfolio-container">
      <h1>Portfolio</h1>
      {loading ? (
        <ClipLoader />
      ) : (
        <>
          <ul>
            <div className="module-border-wrap">
              <div className="module">
                <li>Portfolio Value: <span className="bold">${toCurrency(stockValue() + cash)}</span></li>
                <li>Stock Value: <span className="bold">${toCurrency(stockValue())}</span></li>
                <li>Cash Balance: <span className="bold">${toCurrency(cash)}</span></li>
              </div>
            </div>
          </ul>
          <h3>Investments</h3>
          <div className="investments-chart">
            <TableContainer component={Paper}>
              <Table className={classes.table} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Stock Ticker</TableCell>
                    <TableCell align="right">Number of shares</TableCell>
                    <TableCell align="right">Current price per share</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row:any) => (
                    <TableRow key={row.stock}>
                      <TableCell component="th" scope="row">
                        {row.stock}
                      </TableCell>
                      <TableCell align="right">{row.shares}</TableCell>
                      <TableCell align="right">${toCurrency(row.price)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </>
      )}
    </div>
  )
}