import { useEffect, useState } from "react";
import { socket } from "../socket";


interface Props {
    me: string;
    onSelectUser: (user: string) => void;
}


export const UsersList = ({ me, onSelectUser }: Props) => {

    const [users, setUsers] = useState<string[]>([]);


    useEffect(() => {
        socket.on("users_online", (list: string[]) => {
            setUsers(list.filter(u => u !== me))
        })

        return () => {
            socket.off("users_online");
        }
    }, [me])


    return (
        <div className="userList">
            <h3>Online Users</h3>
            <div className="clobalBtn" onClick={ ()=> onSelectUser("")}>Global chat</div>
            <div className="users-container">
            {users.map(u => (
                <div className="user-item" key={u} onClick={ ()=> onSelectUser(u)}>
                    {u}
                </div>
            ))}
            </div>
        </div>
    )
}
