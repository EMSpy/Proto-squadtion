import { Router } from "express";
import { db } from "./config/db.js";



const router = Router()

router.get("/", async (req, res) => {

    try {
        const result = await db.query("SELECT username, message FROM messages ORDER BY id ASC")
        res.status(200).json(result.rows)

    } catch (error) {
        res.status(404).json({message: "Error fetching message"})
    }
})






export default router