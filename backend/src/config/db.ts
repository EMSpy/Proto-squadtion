import { Pool } from "pg";
import dotenv from "dotenv"
import chalk from 'chalk';

dotenv.config()

export const db: Pool = new Pool({
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    host: process.env.PG_HOST,
    port: Number(process.env.PG_PORT),
    database: process.env.PG_DATABASE
});

export const connectDB = async () => {
    let client;
    try {
        client = await db.connect(); 
        await client.query('SELECT 1'); 
        console.log(chalk.cyan.bold("PostgreSQL connected"));
        
    } catch (error) {
        console.error(chalk.red.bold("Error to connect PostgreSQL:"), error);
        
    } finally {
        if (client) {
            client.release();
        }
    }
};

db.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(1);
});