import { Server, Socket } from "socket.io"
import { db } from "../config/db.js"
import { ChatMessage, PrivateMessage } from "../types.js";


const usernameToSocket = new Map<string, string>()

const socketToUsername = new Map<string, string>()


export const chatSocket = (io: Server) => {

    io.on("connection", (socket: Socket) => {

        console.log("User is connected:", socket.id)

        socket.on("register_user", async (username: string) => {

            usernameToSocket.set(username, socket.id)
            socketToUsername.set(socket.id, username)


            try {
                await db.query(
                    `INSERT INTO users (username) VALUES ($1)
                    ON CONFLICT (username) DO NOTHING`,
                    [username]
                )

            } catch (error) {
                console.log("DB has an error to register the user")
            }

            io.emit("users_online", Array.from(usernameToSocket.keys()))

        })



        socket.on("send_message", async (data: ChatMessage) => {
            const { username, message } = data

            try {
                await db.query(
                    "INSERT INTO messages (username, message) VALUES ($1, $2)",
                    [username, message]
                )
            } catch (error) {
                console.log("DB error to insert global messages")
            }

            io.emit("receive_message", { username, message })
        })


        socket.on("send_private_message", async (data: PrivateMessage) => {
            const { from, to, message } = data

            try {
                
                db.query(
                    "INSERT INTO private_messages (sender, receiver, message) VALUES ($1, $2, $3)",
                    [from, to, message]
                )

            } catch (error) {
                console.log("Error to insert private message")
            }

            const targetSocketId = usernameToSocket.get(to)
            if(targetSocketId) {
                io.to(targetSocketId).emit("receive_private_message", {
                    from,
                    message
                })
            }

            socket.emit("receive_private_message", {from, message})
        })


        socket.on("disconnect", () => {
            const username = socketToUsername.get(socket.id)
            if(username) {
                usernameToSocket.delete(username)
            }
            socketToUsername.delete(socket.id)

            io.emit("users_online", Array.from(usernameToSocket.keys()))
            console.log("User is disconnected:", socket.id)
        })


    })
}