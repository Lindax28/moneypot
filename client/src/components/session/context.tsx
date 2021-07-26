import React, { createContext, PropsWithChildren, useEffect, useState } from 'react';
import Axios, { AxiosResponse } from 'axios';
import { UserInterface } from '../../types/user';

export const userContext = createContext<Partial<UserInterface>>({})
export default function Context(props: PropsWithChildren<any>) {
  const [user,setUser] = useState<UserInterface>()
  useEffect(() => {
    Axios.get("http://localhost:3000/user", { 
      withCredentials: true 
    })
    .then((res: AxiosResponse) => {
      setUser(res.data);
    })
  }, []);

  return (
    <userContext.Provider value={user!}>{props.children}</userContext.Provider>
    )
}