import React, { useState, useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import Routes from './Routes';
import './App.css';

const App = props => {
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);

  useEffect(() => {
    onLoad();
  }, []);

  async function onLoad() {
    try {
      await Auth.currentSession();
      userHasAuthenticated(true);
    } catch (e) {
      if (e !== 'No current user') {
        alert(e);
      }
    }

    setIsAuthenticating(false);
  }

  async function handleLogout() {
    await Auth.signOut();

    userHasAuthenticated(false);

    props.history.push('/login');
  }

  return (
    !isAuthenticating && (
      <div className="App">
        <>
          <Link to="/">Homepage</Link>
          <hr />
          <Link to="/signup">Signup</Link>
          <hr />
          <Link to="/login">Login</Link>
          <hr />

          <button onClick={handleLogout}>Logout</button>
          <hr />
        </>
        <Routes appProps={{ isAuthenticated, userHasAuthenticated }} />
      </div>
    )
  );
};

export default withRouter(App);
