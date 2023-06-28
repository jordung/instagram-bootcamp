import React, { createContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import MessageList from "./components/MessageList";
import MessageForm from "./components/MessageForm";
import AuthForm from "./components/AuthForm";
import Error from "./components/Error";

import { useState, useEffect } from "react";
import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Navbar from "./components/Navbar";

export const UserContext = createContext({});

function App() {
  const [user, setUser] = useState({});

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      }
    });
  }, [user]);

  const handleSignOut = () => {
    signOut(auth).then(() => {
      setUser({});
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <BrowserRouter>
          <UserContext.Provider value={user}>
            <Navbar handleSignOut={handleSignOut} />

            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<AuthForm />} />
              <Route path="messageList" element={<MessageList />} />
              <Route path="messageForm" element={<MessageForm />} />
              {/* <Route
                path="form"
                element={
                  <RequireAuth redirectTo="/login">
                    <MessageForm />
                  </RequireAuth>
                }
              /> */}
              <Route path="*" element={<Error />} />
            </Routes>
          </UserContext.Provider>
        </BrowserRouter>
      </header>
    </div>
  );
}

export default App;
