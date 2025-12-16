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
        <div>
            <h3>Online Users</h3>
            {users.map(u => (
                <div key={u} onClick={ ()=> onSelectUser(u)}>
                    {u}
                </div>
            ))}
        </div>
    )
}
