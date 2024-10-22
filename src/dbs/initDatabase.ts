const { Pool } = require("pg");
import dotenv from "dotenv";
dotenv.config();

// Create a new pool instance
const db = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
        rejectUnauthorized: false // required for SSL connections
    },
    max: 20,
    idleTimeoutMillis: 300000,
});

setInterval(async () => {
    try {
        await db.query('SELECT 1');
        console.log('Connection is alive');
    } catch (err) {
        console.error('Error keeping connection alive:', err);
    }
}, 100000);

// Connect to the PostgreSQL database
db.connect()
    .then(() => console.log("Connected to PostgreSQL"))
    .catch((err: any) => {
        console.error("Connection error", err.stack);
    });

export default db;
