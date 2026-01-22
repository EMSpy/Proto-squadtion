import { useEffect, useState } from "react";
import { socket } from "../socket";
import Cookies from "js-cookie";


interface Props {
    me: string;
    onSelectUser: (user: string) => void;
}


export const UsersList = ({ me, onSelectUser }: Props) => {

    const [users, setUsers] = useState<{ username: string }[]>([]);
    const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

    useEffect(() => {
        const getUsers = async () => {
            const token = Cookies.get("token");
            if (!token) return;

            try {
                const res = await fetch("http://localhost:4000/api/messages/all-users", {
                    headers: { "Authorization": `Bearer ${token}` }
                });

                if (res.ok) {
                    const data = await res.json();
                    setUsers(data.filter((u: any) => u.username !== me));
                }
            } catch (error) {
                console.log(error);
            }
        };
        getUsers();
    }, [me]);



    useEffect(() => {

        const handleUsersOnline = (list: string[]) => {
            setOnlineUsers(list)
        }

        socket.on("users_online", handleUsersOnline)

        return () => {
            socket.off("users_online", handleUsersOnline);
        }
    }, [])


    return (
        <div className="userList">
            <h3>Users</h3>
            <div className="clobalBtn" onClick={() => onSelectUser("")}>Global chat</div>

            <div className="users-container">
                {users
                    .sort((a, b) => {
                        const aOnline = onlineUsers.includes(a.username);
                        const bOnline = onlineUsers.includes(b.username);
 
                        if (aOnline && !bOnline) return -1;
                        if (!aOnline && bOnline) return 1;
            
                        return a.username.localeCompare(b.username);
                    })



                    .map((userObj) => {
                        const name = userObj.username;
                        const isOnline = onlineUsers.includes(name);

                        return (
                            <div
                                key={name}
                                onClick={() => onSelectUser(name)}
                                className={`user-item ${isOnline ? 'online' : 'offline'}`}
                            >
                                {name}
                            </div>
                        );
                    })}
            </div>
        </div>
    )
}
