import React from 'react';
import {
    Route,
    Redirect,
    // withRouter
  } from 'react-router-dom'

const PrivateRoute = ({ component: Component, ...rest }) => {
    return (
      <Route
        {...rest}
        render={props =>
          // status.loggedIn ? (
        //   getFromStorage('the_main_app') ? (
        //filler for now
        props ? (  
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

  export default PrivateRoute;