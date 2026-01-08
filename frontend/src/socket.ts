import { io } from "socket.io-client";
import Cookies from "js-cookie";

export const socket = io("http://localhost:4000", {
    autoConnect: false,
    auth: (cb) => {
        cb({
            token: Cookies.get("token")
        })
    }
});
