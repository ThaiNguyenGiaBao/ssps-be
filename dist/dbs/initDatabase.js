"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const { Pool } = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
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
setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield db.query('SELECT 1');
        console.log('Connection is alive');
    }
    catch (err) {
        console.error('Error keeping connection alive:', err);
    }
}), 100000);
// Connect to the PostgreSQL database
db.connect()
    .then(() => console.log("Connected to PostgreSQL"))
    .catch((err) => {
    console.error("Connection error", err.stack);
});
exports.default = db;
