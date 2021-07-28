import { useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import config from '../../config/keys';

export default function Login() {
  const [email, setEmail] = useState<string>("")
  const [error, setError] = useState<string>("")
  const [password, setPassword] = useState<string>("")

  const login = () => {
    axios.post(`${config.API_URL}/login`, {
      email,
      password
    }, {
      withCredentials: true
    }).then((res : AxiosResponse) => {
       window.location.href = "/"
    }, (res) => {
      setError("User not found")
    })
  }

  return (
    <div>
      <h1>Login</h1>
      <h4>{error}</h4>
      <input type="text" placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
      <button onClick={login}>Login</button>
    </div>
  )
}