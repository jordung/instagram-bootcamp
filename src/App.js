import React from "react";
import { onChildAdded, push, ref as databaseRef, set } from "firebase/database";
import { database, storage } from "./firebase";
import {
  getDownloadURL,
  uploadBytes,
  ref as storageRef,
} from "firebase/storage";
import logo from "./logo.png";
import "./App.css";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const DB_MESSAGES_KEY = "messages";

class App extends React.Component {
  constructor(props) {
    super(props);
    // Initialise empty messages array in state to keep local state in sync with Firebase
    // When Firebase changes, update local state, which will update local UI
    this.state = {
      messages: [],
      textInputValue: "",
    };
  }

  componentDidMount() {
    const messagesRef = databaseRef(database, DB_MESSAGES_KEY);
    // onChildAdded will return data for every child at the reference and every subsequent new child
    onChildAdded(messagesRef, (data) => {
      // Add the subsequent child to local component state, initialising a new array to trigger re-render
      this.setState((state) => ({
        // Store message key so we can use it as a key in our list items when rendering messages
        messages: [...state.messages, { key: data.key, val: data.val() }],
      }));
    });
  }

  handleChange = (e) => {
    this.setState({
      textInputValue: e.target.value,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const messageListRef = databaseRef(database, DB_MESSAGES_KEY);
    const newMessageRef = push(messageListRef);
    set(newMessageRef, {
      message: this.state.textInputValue,
      date: new Date().toLocaleString(),
    });
    this.setState({
      textInputValue: "",
    });
  };

  render() {
    // Convert messages in state to message JSX elements to render
    let messageListItems = this.state.messages.map((message) => (
      <li key={message.key}>
        {message.val.date} - {message.val.message}
      </li>
    ));
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <form>
            <input
              type="text"
              value={this.state.textInputValue}
              onChange={this.handleChange}
            />
            <button onClick={this.handleSubmit}>Send</button>
          </form>
          <ol>{messageListItems}</ol>
        </header>
      </div>
    );
  }
}

export default App;
