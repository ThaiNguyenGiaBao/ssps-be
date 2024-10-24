const { Pool } = require("pg");
import dotenv from "dotenv";
dotenv.config();

let db: any;
// Create a new pool instance
try {
    db = new Pool({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        ssl: {
            rejectUnauthorized: false // Allows self-signed certificates, set to true in production for security
        }
    });
} catch (err: any) {
    console.log("Error in creating pool", err.message);
}

// Connect to the PostgreSQL database
db.connect()
    .then(() => console.log("Connected to PostgreSQL"))
    .catch((err: any) => {
        console.error("Connection error", err.stack);
    });

export default db;
