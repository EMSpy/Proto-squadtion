import express from "express"
import http from "http"
import { Server } from "socket.io"
import cors from "cors"
import { chatSocket } from "./sockets/chatSocket.js"
import { connectDB } from "./config/db.js"


const app = express()
app.use(cors())
app.use(express.json())

connectDB()

//create server
const server = http.createServer(app)

//socket.io init
const io = new Server(server, {
    cors: {
        origin:"*",
    }
})


chatSocket(io)

export default server