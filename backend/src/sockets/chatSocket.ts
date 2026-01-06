import { Server, Socket } from "socket.io";
import { db } from "../config/db.js";
import { ChatMessage, PrivateMessage } from "../types/types.js";

const usernameToSocket = new Map<string, string>();
const socketToUsername = new Map<string, string>();

export const chatSocket = (io: Server) => {
    io.on("connection", (socket: any) => {
        
        const { username } = socket.user; 
        console.log("User authenticated and connected:", username);

        usernameToSocket.set(username, socket.id);
        socketToUsername.set(socket.id, username);

        io.emit("users_online", Array.from(usernameToSocket.keys()));

        socket.on("send_message", async (data: ChatMessage) => {
            const { message } = data; 
            
            try {
                await db.query(
                    "INSERT INTO messages (username, message) VALUES ($1, $2)",
                    [username, message] 
                );
                
                io.emit("receive_message", { username, message });
            } catch (error) {
                console.error("DB error global message:", error);
            }
        });

        socket.on("send_private_message", async (data: PrivateMessage) => {
            const { to, message } = data;
            const from = username; 
            try {
                await db.query(
                    "INSERT INTO private_messages (sender, receiver, message) VALUES ($1, $2, $3)",
                    [from, to, message]
                );

                const targetSocketId = usernameToSocket.get(to);
                if (targetSocketId) {
                    io.to(targetSocketId).emit("receive_private_message", { from, message });
                }
                

                socket.emit("receive_private_message", { from, message });
            } catch (error) {
                console.error("DB error private message:", error);
            }
        });

        socket.on("disconnect", () => {
            usernameToSocket.delete(username);
            socketToUsername.delete(socket.id);
            io.emit("users_online", Array.from(usernameToSocket.keys()));
            console.log("User disconnected:", username);
        });
    });
};