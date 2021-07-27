import React, { createContext, PropsWithChildren, useEffect, useState } from 'react';
import Axios, { AxiosResponse } from 'axios';
import { UserInterface } from '../../types/user';
import config from '../../config/keys';

export const userContext = createContext<Partial<UserInterface>>({})
export default function Context(props: PropsWithChildren<any>) {
  const [user,setUser] = useState<UserInterface>()
  useEffect(() => {
    Axios.get(`${config.API_URL}/user`, { 
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