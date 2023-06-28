import { useState } from "react";
import { push, ref as databaseRef, set } from "firebase/database";
import { database, storage } from "../firebase";
import {
  getDownloadURL,
  uploadBytes,
  ref as storageRef,
} from "firebase/storage";

const DB_MESSAGES_KEY = "messages";
const STORAGE_MESSAGES_KEY = "messages/";

function MessageForm() {
  const [textInputValue, setTextInputValue] = useState("");
  const [fileInputFile, setFileInputFile] = useState("");
  const [fileInputValue, setFileInputValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const messageListRef = databaseRef(database, DB_MESSAGES_KEY);
    const newMessageRef = push(messageListRef);

    const storageRefInstance = storageRef(
      storage,
      STORAGE_MESSAGES_KEY + fileInputFile.name
    );

    // Uploading the file online
    uploadBytes(storageRefInstance, fileInputFile).then((snapshot) => {
      console.log(snapshot);
      console.log("uploaded image");

      getDownloadURL(storageRefInstance).then((url) => {
        set(newMessageRef, {
          message: textInputValue,
          date: new Date().toLocaleString(),
          url: url,
          ref: String(storageRefInstance),
        });
        setTextInputValue("");
        setFileInputFile("");
        setFileInputValue("");
      });
    });
  };

  const handleChange = (e) => {
    setTextInputValue(e.target.value);
  };

  return (
    <div className="App">
      <header className="App-header">
        <form className="form">
          <input
            type="text"
            value={textInputValue}
            onChange={handleChange}
            placeholder="Enter your message"
          />
          <input
            type="file"
            value={fileInputValue}
            onChange={(e) => {
              setFileInputFile(e.target.files[0]);
              setFileInputValue(e.target.value);
            }}
            placeholder="Add file here "
          />
          <button onClick={handleSubmit}>Send</button>
        </form>
      </header>
    </div>
  );
}

export default MessageForm;
