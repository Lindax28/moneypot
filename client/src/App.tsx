import React from 'react';
import Navbar from './components/main/navbar';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Homepage from './components/main/homepage';
import Login from './components/session/login';
import Signup from './components/session/signup';
import Context from './components/session/context';

function App() {
  return (
    <Router>
      <Context>
        <Navbar />
        <Switch>
          <Route path='/' exact component={Homepage} />
          <Route path='/signup' component={Signup} />
          <Route path='/login' component={Login} />
        </Switch>
      </Context>
    </Router>
  );
}

export default App;
