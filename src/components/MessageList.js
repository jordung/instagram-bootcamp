import { useEffect, useState } from "react";
import { database } from "../firebase";
import { onChildAdded, ref as databaseRef } from "firebase/database";
import { Card } from "react-bootstrap";

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

  return (
    <div>
      {messages && messages.length > 0 ? (
        messages.map((messageItem) => (
          <Card
            key={messageItem.key}
            style={{
              width: "50vw",
              height: "50vh",
              margin: "1em",
              padding: "2em",
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
          </Card>
        ))
      ) : (
        <p>No messages</p>
      )}
    </div>
  );
}

export default MessageList;
