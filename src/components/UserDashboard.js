import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from './UserContext';
import axios from 'axios';
import { Link } from 'react-router-dom'

// const Admin = () => {
const UserDashboard = () => {
  const [status, setStatus] = useContext(UserContext);
  const [user, setUser] = useState({admin: false, count: 0});

  useEffect(()=> {
      const abortController = new AbortController();
      const signal = abortController.signal;
  
      axios.get(`http://localhost:4000/account/user/${status.userId}`, {signal: signal})
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
            console.log('userDashboard useEffect clean up...');
            abortController.abort();//cancel subscription by abort
        }
    }, []);

  if (status.loggedIn && user.admin){
    return (
      <div>
        <p>Logged in Only Page...</p>
        <p>Count: {user.count}</p>
        <p>{user.admin ? 'Admin User' : 'Regular User'}</p>
        <Link to="/admin"><button>Admin only page</button></Link>
      </div>
    )
  } else if (status.loggedIn && !user.admin){
    return (
      <div>
        <p>Logged in Only Page...</p>
        <p>Count: {user.count}</p>
        <p>{user.admin ? 'Admin User' : 'Regular User'}</p>
      </div>
    )
  }
  return (
    <div>
      <p>You must be logged in to view</p>
    </div>
  )
};

// export default Admin;
export default UserDashboard;