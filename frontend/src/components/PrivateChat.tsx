import { useEffect, useRef, useState } from "react";
import type { PrivateMessage } from "../types";
import { socket } from "../socket";



interface Props {
    me: string;
    other: string;
}

export const PrivateChat = ({ me, other }: Props) => {

    const [messages, setMessages] = useState<PrivateMessage[]>([]);
    const [message, setMessage] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const getAllMessages = async () => {
            const res = await fetch(`http://localhost:4000/api/messages/private/${me}/${other}`)
            const data = await res.json()
            setMessages(data)
        }
        getAllMessages()
    }, [me, other]);


    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight
        }
    }


    useEffect(() => {
        scrollToBottom();
    }, [messages]);



    useEffect(() => {
        const handler = (data: PrivateMessage) => {
            if (data.from === other || data.from === me) {
                setMessages(prev => [...prev, data])
            }
        }

        socket.on("receive_private_message", handler);

        return () => {
            socket.off("receive_private_message", handler);
        }

    }, [me, other])

    const send = () => {
        if (!message) return

        socket.emit("send_private_message", {
            from: me,
            to: other,
            message,
        })

        setMessage("")
    }

    const sendEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!message) return

        if (e.key === "Enter") {
            e.preventDefault();

            socket.emit("send_private_message", {
                from: me,
                to: other,
                message,
            })

            setMessage("")
        }
    }

    return (
        <div className="chat-container">

            <h2 className="title">Chat with {other}</h2>


            <div className="message-content" ref={messagesEndRef}>
                {
                    messages.map((m, i) => (
                        <div key={i} className="message">
                            <p>{m.from}</p>
                            <p>{m.message}</p>
                        </div>
                    ))
                }
            </div>

            <div className="inputs-container">

                <input
                    placeholder="Message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={sendEnter}
                />

                <button onClick={send}>Send</button>
            </div>

        </div>
    )
}
