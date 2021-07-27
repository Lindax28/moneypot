import React, { useContext } from 'react';
import Navbar from './components/main/navbar';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Homepage from './components/main/homepage';
import Login from './components/session/login';
import Signup from './components/session/signup';
import Stock from './components/stock/stock';
import Portfolio from './components/transactions/portfolio';
import { userContext } from './components/session/context';

function App() {
  const user = useContext(userContext);
  return (
    <Router>
        <Navbar />
        <Switch>
          <Route path='/' exact component={Homepage} />
          <Route exact path="/stock/:symbol" component={Stock} />
          {
            user ? (
              <>
                <Route path='/portfolio' component={Portfolio} />
              </>
            ) : (
              <>
                <Route path='/register' component={Signup} />
                <Route path='/login' component={Login} />
              </>
            )
          }
        </Switch>
    </Router>
  );
}

export default App;
