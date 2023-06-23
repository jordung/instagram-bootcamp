import React from "react";
import logo from "./logo.png";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import MessageList from "./components/MessageList";
import MessageForm from "./components/MessageForm";
import AuthForm from "./components/AuthForm";
import { useState, useEffect } from "react";
import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({});

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      console.log(user);
      if (user) {
        setIsLoggedIn(true);
        setUser(user);
      }
    });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {isLoggedIn ? <h2>Welcome back {user.email}</h2> : null}
        {isLoggedIn ? (
          <button
            onClick={() => {
              setIsLoggedIn(false);
              signOut(auth);
              setUser({});
            }}
          >
            Logout
          </button>
        ) : null}

        {isLoggedIn ? <MessageForm /> : <AuthForm />}
        <MessageList />
      </header>
    </div>
  );
}

export default App;
