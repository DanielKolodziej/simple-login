import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';

// import { UserProvider } from './UserContext';
import { UserContext } from './UserContext';

import { useCookies } from 'react-cookie';

//css styles
const formStyle = {
  marginTop: '5%',
  marginLeft: '5%',
  marginRight: '5%'
}

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

  //cookies---------------------------
  const [cookies, setCookie, removeCookie] = useCookies(['user-cookies']);
  //---------------------------

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setUser({...user, [name]: value});    
  }

  useEffect(()=>{
    console.log('state of global UserContext from Home Component',status);
  },[status])

  useEffect(()=>{
    console.log('state of cookies from Home Component',cookies);
    console.log(cookies.status);
  },[cookies])

  useEffect(()=>{
    const abortController = new AbortController();
    const signal = abortController.signal;


    if (cookies.status) {

      console.log('cookies from home component',cookies);
      axios.get('http://localhost:4000/account/verify?token=' + cookies.status, {signal: signal})
      .then(res => {
        console.log(res.data)
        if (res.data.success) {
            setUser({
              token: cookies.status,
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
  },[cookies])

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
                //set cookie
                setCookie('status', res.data.token, { 
                  path: '/',
                  maxAge: 3600})
              } else {
                setUser({
                  signInError: res.data.message,
                  isLoading: false
                });
              }
        })
  }

  //clears the token from cookie and tells the backend to “delete” the user session
  const logout = () =>{
    setUser({
      isLoading: true,
    });

    if (cookies.status) {
      axios.get('http://localhost:4000/account/logout?token=' + cookies.status)
      .then(res => {
        console.log(res.data)
        if (res.data.success) {
          setUser({
            token: '',
            isLoading: false
          });
          //additional user context
          setStatus(status => ({
            ...status,
            name: '',
            loggedIn: false,
            userId: ''
          }))
          //----------------------------------
          removeCookie('status');
          //--------------------------------
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

  //if user token does not exist....show log in
  if (!user.token){
    return (
      <div>
        <div>
            {
              (user.signInError) ? (
                <p>{user.signInError}</p>
              ) : (null)
            }
      
            <form className="ui form" style={formStyle}>
            <h3>Sign In</h3>
              <div className="field">
                <input
                  type="email"
                  name="signInEmail"
                  placeholder="Email"
                  onChange={handleInputChange}
                />
              </div>
              <div className="field">
                <input
                  type="password"
                  name="signInPassword"
                  placeholder="Password"
                  onChange={handleInputChange}
                />
              </div>
              <button onClick={onSignIn} className="ui primary button">Sign In</button>
            </form>
          </div>

          <div>
            {
              (user.signUpError) ? (
                <p>{user.signUpError}</p>
              ) : (null)
            }

            <form className="ui form" style={formStyle}>
            <h3>Sign Up</h3>
              <div className="field">
                <input
                  type="email"
                  name="signUpEmail"
                  placeholder="Email"
                  onChange={handleInputChange}
                />
              </div>
              <div className="field">
                <input
                  type="password"
                  name="signUpPassword"
                  placeholder="Password"
                  onChange={handleInputChange}
                />
              </div>
              <button onClick={onSignUp} className="ui primary button">Sign Up</button>
            </form>
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
