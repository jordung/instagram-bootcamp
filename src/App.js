import React from "react";
import { onChildAdded, push, ref as databaseRef, set } from "firebase/database";
import { database, storage } from "./firebase";
import {
  getDownloadURL,
  uploadBytes,
  // deleteObject,
  ref as storageRef,
} from "firebase/storage";
import logo from "./logo.png";
import "bootstrap/dist/css/bootstrap.min.css";
import Card from "react-bootstrap/Card";
import "./App.css";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const DB_MESSAGES_KEY = "messages";
const STORAGE_MESSAGES_KEY = "messages/";

class App extends React.Component {
  constructor(props) {
    super(props);
    // Initialise empty messages array in state to keep local state in sync with Firebase
    // When Firebase changes, update local state, which will update local UI
    this.state = {
      messages: [],
      textInputValue: "",
      fileInputFile: null,
      fileInputValue: "",
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

    const storageRefInstance = storageRef(
      storage,
      STORAGE_MESSAGES_KEY + this.state.fileInputFile.name
    );

    // Uploading the file online
    uploadBytes(storageRefInstance, this.state.fileInputFile).then(
      (snapshot) => {
        console.log(snapshot);
        console.log("uploaded image");

        getDownloadURL(storageRefInstance).then((url) => {
          set(newMessageRef, {
            message: this.state.textInputValue,
            date: new Date().toLocaleString(),
            url: url,
            ref: String(storageRefInstance),
          });
          this.setState({
            textInputValue: "",
            fileInputFile: null,
            fileInputValue: "",
          });
        });
      }
    );
  };

  render() {
    // Convert messages in state to message JSX elements to render

    let messageListItems = this.state.messages.map((message) => (
      <Card
        key={message.key}
        style={{
          width: "50vw",
          height: "50vh",
          margin: "1em",
          padding: "2em",
        }}
      >
        <Card.Title>{message.val.date}</Card.Title>
        <div style={{ maxHeight: "90%" }}>
          <img
            style={{ height: "90%", width: "90%", objectFit: "contain" }}
            src={message.val.url}
            alt={message.val.name}
          />
          {/* <br />
          <button
            onClick={() => {
              const ImageToDeleteRef = storageRef(storage, message.val.ref);
              deleteObject(ImageToDeleteRef).then(() => console.log("deleted"));
            }}
          >
            Delete
          </button> */}
        </div>
        <Card.Text>{message.val.message}</Card.Text>
      </Card>
    ));

    // Newest posts will come out on top
    messageListItems.reverse();

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <form className="form">
            <input
              type="text"
              value={this.state.textInputValue}
              onChange={this.handleChange}
              placeholder="Enter your message"
            />
            <input
              type="file"
              value={this.state.fileInputvalue}
              onChange={(e) => {
                this.setState({
                  fileInputFile: e.target.files[0],
                  fileInputvalue: e.target.value,
                });
              }}
              placeholder="Add file here "
            />
            <button onClick={this.handleSubmit}>Send</button>
          </form>
          {messageListItems}
        </header>
      </div>
    );
  }
}

export default App;
