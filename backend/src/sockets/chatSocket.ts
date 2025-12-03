import {Server, Socket } from "socket.io"
import { db } from "../config/db.js"
import { ChatMessage } from "../types.js";

 

export const chatSocket = ( io: Server) => {
    io.on("connection", (socket: Socket) =>{
        console.log("User is connected:", socket.id)

        socket.on("send_message", async (data: ChatMessage) => {
            const  { username, message} = data

            await db.query(
                "INSERT INTO messages (username, message) VALUES ($1, $2)",
                [username, message]
            )

            io.emit("recive_message", {username, message})
        })

        socket.on("disconnect", ()=> {
            console.log("User is disconnected:", socket.id)
        })


    })
}