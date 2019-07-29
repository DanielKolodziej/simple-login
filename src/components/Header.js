import React, { useContext, useEffect } from 'react';

import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  Redirect,
  withRouter
} from 'react-router-dom'
import NotFound from './NotFound';

import Home from './Home';

import HelloWorld from './HelloWorld';
import UserDashboard from './UserDashboard';
import Admin from './Admin';

import { UserContext } from './UserContext';
import {
  setInStorage,
  getFromStorage,
} from '../utils/storage';


const Header = () => {

  const [status, setStatus] = useContext(UserContext);

  useEffect(()=>{
      console.log('state of global UserContext',status);
    },[status])

    function PrivateRoute({ component: Component, ...rest }) {
      return (
        <Route
          {...rest}
          render={props =>
            status.loggedIn ? (
              <Component {...props} />
            ) : (
              <Redirect
                to={{
                  pathname: "/",
                  state: { from: props.location }
                }}
              />
            )
          }
        />
      );
    }

  return (
    <Router>
        <Link to="/">Home</Link>
        <br />
        <br />
        <nav>
          <Link to="/helloworld">Everyone</Link>
          <br />
          {status.loggedIn ? <Link to={`/dashboard`}>Logged in Only</Link> : ''}
        </nav>
        <hr />
        <Switch>
            <Route exact path="/" component={ Home }/>
            <Route path="/helloworld" component={ HelloWorld }/>
            <PrivateRoute exact path="/dashboard" component={ UserDashboard }/>
            <PrivateRoute exact path="/admin" component={ Admin }/>
            <Route component={NotFound}/>
        </Switch>
      </Router>
  );

};


export default Header;
