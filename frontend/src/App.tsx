import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { socket } from "./socket";
import { Chat } from "./components/Chat";
import { UsersList } from "./components/UsersList";
import { PrivateChat } from "./components/PrivateChat";

function App() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");

  const [displayName, setDisplayName] = useState("");
  const [logged, setLogged] = useState(false);
  const [chatWith, setChatWith] = useState<string | null>(null);
  const [error, setError] = useState<string | false>(false)
  const [message, setMessage] = useState<string | false>(false)

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        setDisplayName(decoded.username);
        setLogged(true);
        socket.connect();
      } catch (e) { handleLogout(); }
    }
  }, []);


const handleAuth = async () => {

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email.trim() || !password.trim()) {
    setError("Please fill in Email and Password");
    return; 
  }

  if (!emailRegex.test(email)) {
     setError("Please enter a valid email address (e.g., user@example.com)");
    return;
  }

  if (password.length < 5) {
     setError("Password must be at least 5 characters long");
    return;
  }

  if (isRegistering && !userName.trim()) {
     setError("Please enter a Username for registration");
    return;
  }

  if (isRegistering) {
    if (!userName.trim()) {
       setError("Username is required for registration");
      return;
    }
    if (userName.trim().length < 5) {
       setError("Username must be at least 5 characters long");
      return;
    }
  }

  const endpoint = isRegistering ? "register" : "login";
  const body = isRegistering 
    ? { email, password, userName } 
    : { email, password };

  try {
    const res = await fetch(`http://localhost:4000/api/auth/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (res.ok) {
      if (isRegistering) {
        setMessage("Account was created")
        setIsRegistering(false); 
      } else {
        Cookies.set("token", data.token, { expires: 1 });
        setDisplayName(data.username);
        setLogged(true);
        socket.connect();
      }
    } else {
       setError(data.message || "Error in the process");
    }
  } catch (error) {
    console.error("Auth error:", error);
     setError("Connection error with the server");
  }
};
  const handleLogout = () => {
    Cookies.remove("token");
    socket.disconnect();
    setLogged(false);
    setChatWith(null);
  };


  if(error) {
    setTimeout(() => {
      setError(false)
    }, 4000);
  }
  if(message) {
    setTimeout(() => {
      setMessage(false)
    }, 4000);
  }

  if (!logged) {
    return (
      <div className="loginchat-container" style={{ height: isRegistering ? 'auto' : '200px' }}>
        <h2 className="loginchat">{isRegistering ? "Create Account" : "Login"}</h2>

        {isRegistering && (
          <input
            type="text"
            placeholder="User Name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleAuth}
          disabled={!email || !password || (isRegistering && !userName)}
          style={{ opacity: (!email || !password) ? 0.5 : 1 }}
        >
          {isRegistering ? "Sign Up" : "Sign In"}
        </button>

          { error && <p className="errorlabel">{error}</p> }
          { message && <p className="succeslabel">{message}</p> }
        <p className="registeruser"
          onClick={() => setIsRegistering(!isRegistering)}>
          {isRegistering ? "If you have an account go to login" : "If you do not have account go to create one"}
        </p>
      </div>
    );
  }

  return (
    <div className="chat-app-wrapper">
      <header style={{ color: 'white', display: 'flex', justifyContent: 'space-between', padding: '10px' }}>
        <span>User: <strong>{displayName}</strong></span>
        <button className="logoutbutton" onClick={handleLogout}>Log out</button>
      </header>

      <div className="chatpage">
        <UsersList me={displayName} onSelectUser={setChatWith} />
        {chatWith ? (
          <PrivateChat me={displayName} other={chatWith} />
        ) : (
          <Chat username={displayName} />
        )}
      </div>
    </div>
  );
}

export default App;