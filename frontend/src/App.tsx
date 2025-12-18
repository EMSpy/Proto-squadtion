import { useState } from "react";
import { Chat } from "./components/Chat"
import { socket } from "./socket";
import { UsersList } from "./components/UsersList";
import { PrivateChat } from "./components/PrivateChat";



function App() {

  const [username, setUsername] = useState("");
  const [logged, setLogged] = useState(false)
  const [chatWith, setChatWith] = useState<string | null>(null);

  const handleConnect = () => {
    if (!username) return

    socket.connect()
    socket.emit("register_user", username)
    setLogged(true)
  }

  const handleConnectEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!username) return

    if (e.key === "Enter") {
      e.preventDefault();
      socket.connect()
      socket.emit("register_user", username)
      setLogged(true)
    }
  }

  if (!logged) {
    return (
      <div className="loginchat-container">
        <h2 className="loginchat">Login</h2>
        <input
          id="name"
          type="text"
          placeholder="Name.."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={handleConnectEnter}
        />
        <button onClick={handleConnect}>Enter</button>
      </div>
    )
  }



  return (
    <div className="chatpage">

      <UsersList me={username} onSelectUser={setChatWith} />

      {
        chatWith ? <PrivateChat me={username} other={chatWith} />
          : <Chat username={username} />
      }
    </div>
  )
}

export default App
