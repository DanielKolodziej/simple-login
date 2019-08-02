import React, { useContext, useEffect } from 'react';

import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  // withRouter
} from 'react-router-dom'

import NotFound from './NotFound';
import Home from './Home';
import HelloWorld from './HelloWorld';
import UserDashboard from './UserDashboard';
import Admin from './Admin';
import PrivateRoute from './PrivateRoute';

//React Context API
import { UserContext } from './UserContext';

//react cookie library
import { withCookies } from 'react-cookie';
import { useCookies } from 'react-cookie';


const Header = () => {
  // const [status, setStatus] = useContext(UserContext);
  const [status] = useContext(UserContext);
  
  const [cookies] = useCookies(['user-cookies'])

  useEffect(()=>{
      console.log('state of global UserContext header component',status);
    },[status])

  useEffect(()=>{
      console.log('state of cookies header component',cookies);
  },[cookies])

  return (
    <Router>
        <nav className="ui three item menu">
          <Link to="/" className="item">Home</Link>
          <Link to="/helloworld" className="item">Everyone</Link>
          {/* if cookies true, display link to logged in dashboard */}
          {cookies ? <Link to={`/dashboard`} className="item">Logged in Only</Link> : ''}
        </nav>
        {/* <Switch>
            <Route 
              exact path="/" 
              render={()=>(<Home cookies={this.props.cookies}/>)}/>
            <Route 
              path="/helloworld" 
              render={()=>(<HelloWorld cookies={this.props.cookies}/>)}/>
            <PrivateRoute 
              exact path="/dashboard" 
              render={()=>(<UserDashboard cookies={this.props.cookies}/>)}/>
            <PrivateRoute 
              exact path="/admin" 
              render={()=>(<Admin cookies={this.props.cookies}/>)}/>
            <Route 
              render={()=>(<NotFound cookies={this.props.cookies}/>)}/>
        </Switch> */}
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


export default withCookies(Header);
