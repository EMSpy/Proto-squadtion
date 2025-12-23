import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "./config/db.js";

const router = Router()


router.post("/register", async (req, res) => {

    try {
        const { userName, email, password } = req.body

        const checkUser = await db.query("SELECT email FROM users WHERE email = $1", [email])
          
        if (checkUser.rows.length > 0) return res.status(409).json({ message: "User already exists" })
            
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










export default router