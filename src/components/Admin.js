import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from './UserContext';
import axios from 'axios';

const Admin = (props) => {
  console.log(props);
  console.log(props.match.params.id);
  const [status, setStatus] = useContext(UserContext);
  const [user, setUser] = useState({admin: false, count: 0});

  useEffect(()=> {
      const abortController = new AbortController();
      const signal = abortController.signal;
  
      axios.get(`http://localhost:4000/account/user/5d3b31ea8ec90d1d6c2e0a35`, {signal: signal})
      // axios.get(`http://localhost:4000/account/user/${props.match.params.id}`, {signal: signal})
            .then(response => {
              console.log(response.data);
                setUser({
                    admin: response.data.admin,
                    count: response.data.count
                });
            })
            .catch(error => {
                console.log(error);
            })

        return function cleanup(){
            console.log('admin useEffect clean up...');
            abortController.abort();//cancel subscription by abort
        }
    }, []);

  return (
    <div>
      {status.loggedIn ? <p>Logged in Only Page...</p> : <p>You must be logged in to view</p>}
      <p>Count: {user.count}</p>
      <p>{user.admin ? 'Admin User' : 'Regular User'}</p>
    </div>
  )
};

export default Admin;