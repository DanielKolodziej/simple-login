import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import {
  setInStorage,
  getFromStorage,
} from '../utils/storage';

// import { UserProvider } from './UserContext';
import { UserContext } from './UserContext';

const Home = () => {
  const initialState = {
    isLoading: true,
    token: '',
    signUpError: '',
    signInError: '',
    signInEmail: '',
    signInPassword: '',
    signUpEmail: '',
    signUpPassword: ''
  };
  const [user, setUser] = useState(initialState);

  //--------------------------------------------------------
  //global context
  const [status, setStatus] = useContext(UserContext);
  //----------------------------------------------------------

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setUser({...user, [name]: value});    
  }

  useEffect(()=>{
    console.log('state of global UserContext from Home Component',status);
  },[status])

  useEffect(()=>{
    const abortController = new AbortController();
    const signal = abortController.signal;

    //Change the_main_app to be your websites name. 
    //It just has to be unique. Make sure you change all instances of it.
    const obj = getFromStorage('the_main_app');
    if (obj && obj.token) {
      const { token } = obj;
      console.log('1111111111111111111111111111111');
      console.log('obj in home component',obj);
      axios.get('http://localhost:4000/account/verify?token=' + token, {signal: signal})
      .then(res => {
        console.log(res.data)
        if (res.data.success) {
            setUser({
              token,
              isLoading: false
            });
          } else {
            setUser({
              isLoading: false,
            });
          }
        })

        return function cleanup(){
          console.log('home useEffect clean up...');
          abortController.abort();//cancel subscription by abort
      }
      
    } else {
      setUser({
        isLoading: false
      })
    }
  },[])

  const onSignUp = () => {
    setUser({
      isLoading: true,
    });

    const response = { 
      email: user.signUpEmail,
      password: user.signUpPassword
    };
  axios.post('http://localhost:4000/account/signup', response)
      .then(res => {
        console.log(res.data)
        if (res.data.success){
          setUser({
            signUpError: res.data.message,
            isLoading: false,
            signUpEmail: '',
            signUpPassword: ''
          });
        } else {
          setUser({
            signUpError: res.data.message,
            isLoading: false
          });
        }
      });
  }

  const onSignIn = () => {
    setUser({
      isLoading: true
    });
    const response = { 
      email: user.signInEmail,
      password: user.signInPassword
    };
    axios.post('http://localhost:4000/account/signin', response)
        .then(res => {
          console.log('onSignin res.data:',res.data);
          if (res.data.success){
                setInStorage('the_main_app', { 
                  token: res.data.token,
                  //store name and status state in localstorage test?
                  // name: user.signInEmail,
                  // status: status
                });
                setUser({
                  signInError: res.data.message,
                  isLoading: false,
                  signInPassword: '',
                  signInEmail: user.signInEmail,
                  token: res.data.token
                });
                //additional user context
                setStatus(status => ({
                  ...status,
                  name: user.signInEmail,
                  loggedIn: true,
                  userId: res.data.userId
                }))
                console.log('Status state home:', status)
                // setInStorage('the_main_app', { 
                //   token: res.data.token,
                //   //store name and status state in localstorage test?
                //   name: user.signInEmail,
                //   info: status
                // });
                //---------------------------
              } else {
                setUser({
                  signInError: res.data.message,
                  isLoading: false
                });
              }
        })
  }

  //clears the token from local storage and tells the backend to “delete” the user session
  const logout = () =>{
    setUser({
      isLoading: true,
    });
    const obj = getFromStorage('the_main_app');
    if (obj && obj.token) {
      const { token } = obj;

      axios.get('http://localhost:4000/account/logout?token=' + token)
      .then(res => {
        console.log(res.data)
        if (res.data.success) {
          localStorage.removeItem('the_main_app');
          setUser({
            token: '',
            isLoading: false
          });
          //additional user context
          setStatus(status => ({
            ...status,
            name: '',
            loggedIn: false
          }))
          //----------------------------------
        } else {
          setUser({
            isLoading: false,
          });
        }
      });
  } else {
    setUser({
      isLoading: false,
    });
  }
  }
      
  if (user.isLoading){
    return (
      <div>
        <p>Loading...</p>
      </div>
    )
  } 
  if (!user.token){
    return (
      <div>
        <div>
            {
              (user.signInError) ? (
                <p>{user.signInError}</p>
              ) : (null)
            }
            <p>Sign In</p>
            <input
              type="email"
              name="signInEmail"
              placeholder="Email"
              // value={user.signInEmail}
              onChange={handleInputChange}
            />
            <br />
            <input
              type="password"
              name="signInPassword"
              placeholder="Password"
              // value={user.signInPassword}
              onChange={handleInputChange}
            />
            <br />
            <button onClick={onSignIn}>Sign In</button>
          </div>
          <br />
          <br />
          <div>
            {
              (user.signUpError) ? (
                <p>{user.signUpError}</p>
              ) : (null)
            }
            <p>Sign Up</p>
            <input
              type="email"
              name="signUpEmail"
              placeholder="Email"
              // value={user.signUpEmail}
              onChange={handleInputChange}
            /><br />
            <input
              type="password"
              name="signUpPassword"
              placeholder="Password"
              // value={user.signUpPassword}
              onChange={handleInputChange}
            /><br />
            <button onClick={onSignUp}>Sign Up</button>
          </div>
      </div>
    )
  }

  return (
      <div>
        <p>Welcome: {status.name}</p>

        <button onClick={logout}>Logout</button>
      </div>
  );

}

export default Home;
