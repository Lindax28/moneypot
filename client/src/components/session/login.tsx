import React, { useState } from 'react';
import axios, { AxiosResponse } from 'axios';

export default function Login() {
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")

  const login = () => {
    axios.post("http://localhost:3000/login", {
      email,
      password
    }, {
      withCredentials: true
    }).then((res : AxiosResponse) => {
      if (res.data.id) {
       window.location.href = "/"
     }
    }, () => {
      console.log("Failure");
    })
  }

  // const getUser = () => {
  //   axios.get("http://localhost:3000/user", {
  //     withCredentials: true
  //   }).then(res => {
  //     console.log(res.data);
  //   })
  // }

  return (
    <div>
      <h1>Login</h1>
      <input type="text" placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
      <button onClick={login}>Login</button>
    </div>
  )
}