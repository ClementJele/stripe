import React, { useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from 'react-router-dom';
import '../globalStyle.css';
import axios from 'axios';

const postUser = async (name, email) => {
  const user = {
    name: name,
    email: email,
    liked_events: [],
    my_events: []
  }
  console.log("User: ", user);
  try {
    await axios.post(`${process.env.REACT_APP_USER_URI}/api/users/create`, user, {
      headers: {
        'Content-Type': 'application/json',
      }
    }).then( response => {
      console.log("Response");
      sessionStorage.setItem('user', JSON.stringify(response.data));
    });
  } catch (error) {
    console.log(error);
  }
}

const Login =  () => {
  // const { user, loginWithRedirect, isAuthenticated } = useAuth0();
  const navigate = useNavigate();
  // useEffect(() => {
    const handleLogin = async () => {
      // if (isAuthenticated) {
        // Wait for postUser to finish before navigating
        // await postUser(user.name, user.email);
        navigate('/home');
      }
    // };
    handleLogin();
  // }, [isAuthenticated, user, navigate]);
  return (
    <div>
      {/* <h2>Welcome! Please log in.</h2> */}
      <button onClick={() => handleLogin()} className='Login'>Log In</button>
    </div>
  );
  
};

export default Login;