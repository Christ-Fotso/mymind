const express = require('express');
const cors = require('cors');
import dotenv from "dotenv";
dotenv.config;
import db_pool from './config/db.js';

const app = express();
const PORT = 5000;

// Middleware
app.use(cors()); // Important pour que le React (port 5173) puisse parler à l'Express (port 5000)
app.use(express.json());

// Route de base pour tester
app.get('/', async (req, res) => {
    const result =await db_pool.querry('select current_database()');
});

// Lancement
app.listen(PORT, () => {
    console.log(`Server mymind running on http://localhost:${PORT}`);
});