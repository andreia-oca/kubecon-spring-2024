import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import { BackendService, Message } from "@genezio-sdk/genezio-demo";
import "./App.css";

export default function App() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [response, setResponse] = useState("");

  async function sayHello() {
    setResponse(await BackendService.hello(name));
  }

  async function send() {
    await BackendService.addMessage(message);
    updateMessages();
  }

  useEffect(() => {
    async function fetchMessages() {
      try {
        const messages = await BackendService.getMessages(0, true);
        setMessages(messages || []);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    }

    fetchMessages();
  }, []);

  useEffect(() => {
    updateMessages();
  }, []);

  async function updateMessages() {
    try {
      const messages = await BackendService.getMessages(0, true);
      setMessages(messages || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  }

  return (
    <>
      <div>
        <a href="https://genezio.com" target="_blank">
          <img
            src="https://raw.githubusercontent.com/Genez-io/graphics/main/svg/Logo_Genezio_White.svg"
            className="logo genezio light"
            alt="Genezio Logo"
          />
          <img
            src="https://raw.githubusercontent.com/Genez-io/graphics/main/svg/Logo_Genezio_Black.svg"
            className="logo genezio dark"
            alt="Genezio Logo"
          />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Genezio + React = ❤️</h1>
      <div className="card">
        <input
          type="text"
          className="input-box"
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
        />
        <br />
        <br />

        <button onClick={() => sayHello()}>Say Hello</button>
        <p className="read-the-docs">{response}</p>
        <br />
        <br />

        <input
          type="text"
          className="input-box"
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Add your message here"
        />
        <br />
        <br />

        <button onClick={() => send()}>Send</button>

        <div>
          <h2>Messages:</h2>
          <div className="message-container">
            {messages.map((message) => (
              <div key={message.id}>
                <p className="username">
                  {message.message}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
