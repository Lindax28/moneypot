import { useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import config from '../../config/keys';

export default function Signup() {
  const [name, setName] = useState<string>("")
  const [error, setError] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")

  const register = () => {
    axios.post(`${config.API_URL}/register`, {
      name,
      email,
      password
    }, {
      withCredentials: true
    }).then((res : AxiosResponse) => {
       window.location.href = "/"
    }, (res) => {
      setError(res.response.data.message)
    })
  }


  return (
    <div>
      <h1>Sign Up</h1>
      <h4>{error}</h4>
      <input type="text" placeholder="Full Name" onChange={e => setName(e.target.value)} />
      <input type="text" placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
      <button onClick={register}>Register</button>
    </div>
  )
}