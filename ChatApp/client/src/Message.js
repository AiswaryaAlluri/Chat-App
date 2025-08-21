import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { store } from './App';
import BASE_URL from './config';

export default function Messages() {
  const [token] = useContext(store);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  // Fetch all messages on load
  useEffect(() => {
    if (token) {
      axios
        .get('http://localhost:5000/getmsg', {
          headers: { 'x-token': token }
        })
        .then(res => setMessages(res.data))
        .catch(err => console.error(err));
    }
  }, [token]);

  const sendMessage = async () => {
    try {
      await axios.post(
        'http://localhost:5000/addmsg',
        { text: message },
        { headers: { 'x-token': token } }
      );
      setMessage('');
      // Reload messages after sending
      const res = await axios.get('http://localhost:5000/getmsg', {
        headers: { 'x-token': token }
      });
      setMessages(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Messages</h2>
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={sendMessage}>Send</button>
      <ul>
        {messages.map((msg) => (
          <li key={msg._id}>
            <strong>{msg.username}: </strong>{msg.text}
          </li>
        ))}
      </ul>
    </div>
  );
}
