
import { useEffect, useRef, useState } from "react";
import { socket } from "../socket";




export const Chat = () => {

    const [username, setUsername] = useState("");
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<{ username: string; message: string }[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const getAllMessages = async () => {
            const res = await fetch("http://localhost:4000/api/messages")
            const data = await res.json()
            setMessages(data)
        }

        getAllMessages()
    }, [])

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight
        }
    }


    useEffect(() => {
        scrollToBottom();
    }, [messages]);


    useEffect(() => {
        const handler = (data: { username: string; message: string }) => {
            setMessages((prev) => [...prev, data]);
        };

        socket.on("receive_message", handler);

        return () => {
            socket.off("receive_message", handler);
        };
    }, []);

    const sendMessage = () => {
        if (!username || !message) return;

        socket.emit("send_message", { username, message });
        setMessage("");
    };

    const sendMessageEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!username || !message) return;

        if(e.key === "Enter"){
            e.preventDefault();
            
            socket.emit("send_message", { username, message });
            setMessage("");
        }
    };


    return (
        <div className="chat-container">

            <h2 className="title">Squadtion Chat</h2>


            <div className="message-content" ref={messagesEndRef}>
                {
                    messages.map((m, i) => (
                        <div key={i} className="message">
                            <p>{m.username}</p>
                            <p>{m.message}</p>
                        </div>
                    ))
                }
            </div>

            <div className="inputs-container">

                <input
                    placeholder="Name"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <input
                    placeholder="Message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={sendMessageEnter}
                />

                <button onClick={sendMessage}>Send</button>
            </div>

        </div>
    )
}
