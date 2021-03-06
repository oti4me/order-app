import React from 'react';
import auth from '../config/firebase';
import store from "../config/store";

export const verifyLogin = () => {
  auth.onAuthStateChanged(async (user) => {
    try{
      const idToken = await user.getIdToken();
      localStorage.setItem('token', idToken);
      store.dispatch({ type: 'USER_LOGGEDIN', payload: true });
      store.dispatch({ type: 'USER_LOGIN', payload: user });
    } catch (error) {
      store.dispatch({ type: 'USER_LOGGEDIN', payload:  false });
      store.dispatch({ type: 'USER_LOGIN', payload: {}});
      localStorage.removeItem('token');
    }
  });
}

export const Auth = (Component) => (props) => {
  const { pathname } = props.history.location;

  if(localStorage.getItem('token') && pathname === '/login') {
    return props.history.push('orders')
  }

  if(!localStorage.getItem('token') && pathname !== '/login') {
    return props.history.push('/login')
  }

  return (<Component {...props} />)
}

export const getAuthHeader = () => ({
  headers: {
    'x-access-token': localStorage.getItem('token'),
    authorization: localStorage.getItem('token')
  }
});

export const logout = async () => {
  await auth.signOut()
  store.dispatch({ type: 'USER_LOGGEDIN', payload: false });
  store.dispatch({ type: 'USER_LOGIN', payload: {}});
  localStorage.removeItem('token');
}
