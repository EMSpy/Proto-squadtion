import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv"
import { db } from "./config/db.js";

dotenv.config()
const router = Router()


router.post("/register", async (req, res) => {

    try {
        const { userName, email, password } = req.body

        const checkUser = await db.query("SELECT email, username FROM users WHERE email = $1 OR username = $2", [email, userName])
          
        if (checkUser.rows.length > 0 ) return res.status(409).json({ message: "User already exists" })
            
        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = await db.query(
            "INSERT INTO users (username, email, password) VALUES ($1,$2,$3) RETURNING id, username, email",
            [userName, email, hashedPassword]
        )

        res.status(201).json({ message: "user was created", user: newUser.rows[0]})

    } catch (error) {
        res.status(500).json({message: "Internar server error"})
    }
})


router.post("/login" , async (req, res)=> {
    try {
        const { email, password } = req.body

        const result = await  db.query("SELECT * FROM users WHERE email = $1", [email])

        if(result.rows.length === 0) return res.status(401).json({message: "Invalid credentials"})

        const user =  result.rows[0]

        const valid = await bcrypt.compare(password, user.password)

        if(!valid) return res.status(401).json({message: "Invalid credentials"})

        const token = jwt.sign(
            {id: user.id , username: user.username},
            process.env.JWT_SECRET!,
            {expiresIn: "1d"}
        )

        res.json({
            token,
            username: user.username
        })

    } catch (error) {
        res.status(500).json({ message: "Internar server error"})
    }

})









export default router