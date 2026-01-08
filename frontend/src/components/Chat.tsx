import { useEffect, useRef, useState } from "react";
import { socket } from "../socket";
import Cookies from "js-cookie"; 

interface Props {
  username: string;
}

export const Chat = ({ username }: Props) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{ username: string; message: string }[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const getAllMessages = async () => {
      const token = Cookies.get("token"); 
      
      try {
        const res = await fetch("http://localhost:4000/api/messages", {
          headers: {
            "Authorization": `Bearer ${token}` 
          }
        });
        
        if (res.ok) {
          const data = await res.json();
          setMessages(data);
        } else if (res.status === 401) {
          console.error("No autorizado. El token podría haber expirado.");
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    getAllMessages();
  }, []);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handler = (data: { username: string; message: string }) => {
      setMessages((prev) => [...prev, data]);
    };
    socket.on("receive_message", handler);
    return () => { socket.off("receive_message", handler); };
  }, []);

  const sendMessage = () => {
    if (!username || !message) return;
    socket.emit("send_message", { message }); 
    setMessage("");
  };

  return (
    <div className="chat-container">
      <h2 className="title titleGlobal">Global Chat</h2>
      <div className="message-content" ref={messagesEndRef}>
        {messages.map((m, i) => (
          <div key={i} className="message">
            <p>{m.username}</p>
            <p>{m.message}</p>
          </div>
        ))}
      </div>
      <div className="inputs-container">
        <input
          placeholder="Message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};