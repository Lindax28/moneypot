import { userContext } from '../session/context';
import { Link } from 'react-router-dom';
import React, { useEffect, useState, useContext } from 'react';
import Axios, { AxiosResponse } from 'axios';

export default function Trade(props: any) {
  const user = useContext(userContext);
  const [cash, setCash] = useState<number>(0);


  // useEffect(() => {
  //   Axios.get("http://localhost:3000/api/portfolio/balance", {withCredentials: true})
  //   .then((response: AxiosResponse) => {
  //     setCash(response.data.cash_balance);
  //   }, () => {
  //     setStock({
  //       symbol: "", 
  //       volume: 0, 
  //       open: 0, 
  //       close: 0, 
  //       high: 0, 
  //       low: 0,
  //       listdate: "",
  //       industry: "",
  //       sector: "",
  //       country: "",
  //       marketcap: 0,
  //       employees: 0,
  //       ceo: "",
  //       url: "",
  //       description: "",
  //       exchange: "",
  //       name: "",
  //       similar: []
  //     })
  //   })
  // }, [props.match.params.symbol])

  return (
    <div>
      {user ? (
        <>
          <h2>Trade</h2>
          <div>Portfolio Value</div>
          <div></div>
          <div>Cash Available for Trading</div>
        </>
      ) : (
        <Link to="/login">Log in to begin trading!</Link>
      )}
    </div>
  )
}