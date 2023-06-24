import { useEffect, useState } from "react";
import { database } from "../firebase";
import {
  onChildAdded,
  ref as databaseRef,
  remove,
  onChildRemoved,
} from "firebase/database";
import { Card, Button } from "react-bootstrap";
import { deleteObject, ref as storageRef } from "firebase/storage";
import { storage } from "../firebase";

function MessageList() {
  const [messages, setMessages] = useState([]);

  const DB_MESSAGES_KEY = "messages";

  useEffect(() => {
    const messagesRef = databaseRef(database, DB_MESSAGES_KEY);
    // onChildAdded will return data for every child at the reference and every subsequent new child
    onChildAdded(messagesRef, (data) => {
      // Add the subsequent child to local component state, initialising a new array to trigger re-render
      setMessages((state) => [...state, { key: data.key, val: data.val() }]);
    });
  }, []);

  useEffect(() => {
    const messagesRef = databaseRef(database, DB_MESSAGES_KEY);
    onChildRemoved(messagesRef, (data) => {
      let messageArray = [...messages];
      let newMessageArray = messageArray.filter(
        (item) => item.key !== data.key
      );
      setMessages(newMessageArray);
    });
  });

  const handleDelete = (messageKey, fileName) => {
    const deleteFromStorage = storageRef(storage, fileName);
    deleteObject(deleteFromStorage)
      .then(() => console.log("Deleted from storage!"))
      .catch((error) => console.log("Error deleting from storage", error));

    const deleteFromDB = databaseRef(
      database,
      DB_MESSAGES_KEY + "/" + messageKey
    );
    remove(deleteFromDB)
      .then(() => console.log("Deleted from database!"))
      .catch((error) => console.log("Error deleting from database", error));
  };

  return (
    <div>
      {messages && messages.length > 0 ? (
        messages.map((messageItem) => (
          <Card
            key={messageItem.key}
            style={{
              width: "50vw",
              margin: "1em",
              padding: "2em",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Card.Title>{messageItem.val.date}</Card.Title>
            <div style={{ maxHeight: "90%" }}>
              <img
                style={{ height: "90%", width: "90%", objectFit: "contain" }}
                src={messageItem.val.url}
                alt={messageItem.val.name}
              />
            </div>
            <Card.Text>{messageItem.val.message}</Card.Text>
            <Button
              variant="outline-danger"
              className="w-50"
              onClick={() => handleDelete(messageItem.key, messageItem.val.ref)}
            >
              Delete
            </Button>
          </Card>
        ))
      ) : (
        <p>No messages</p>
      )}
    </div>
  );
}

export default MessageList;
