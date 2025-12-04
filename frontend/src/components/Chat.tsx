
import { useEffect, useState } from "react";
import { socket } from "../socket";




export const Chat = () => {

    const [username, setUsername] = useState("");
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<{ username: string; message: string }[]>([]);


    useEffect(() => {
        const handler = (data:{ username: string; message: string }) => {
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

    console.log(messages)

    return (
        <div>
            <h2 className="title">Real time chat</h2>


            <input
                placeholder="Name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />

            <input
                placeholder="Mensgaje..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />

            <button onClick={sendMessage}>Send</button>


            <div className="messageContainer">
                {
                    messages.map((m, i) => (
                        <div key={i} className="message">
                            <h4>{m.username}</h4>
                            <p>{m.message}</p>
                        </div>
                    ))
                }
            </div>

        </div>
    )
}
