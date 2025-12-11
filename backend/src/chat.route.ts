import { Router } from "express";
import { db } from "./config/db.js";



const router = Router()

router.get("/", async (req, res) => {

    try {
        const result = await db.query("SELECT username, message FROM messages ORDER BY id ASC")
        res.status(200).json(result.rows)

    } catch (error) {
        res.status(404).json({ message: "Error fetching message" })
    }
})


router.get("/private/:userA/:userB", async (req, res) => {

    const { userA, userB } = req.params

    try {

        const result = await db.query(
            `SELECT sender as from, receiver as to, message, created_at
             FROM private_messages
             WHERE (sender = $1 AND receiver = $2) OR (sender = $2 AND receiver = $1)
             ORDER BY created_at ASC`,
            [userA, userB]
        )

        res.status(200).json(result.rows)

    } catch (error) {
        res.status(500).json({ message: "Error fetching private messages" })
    }
})





export default router