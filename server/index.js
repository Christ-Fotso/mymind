const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

// Middleware
app.use(cors()); // Important pour que le React (port 5173) puisse parler à l'Express (port 5000)
app.use(express.json());

// Route de base pour tester
app.get('/', (req, res) => {
    res.json({ 
        project: "mymind",
        status: "online", 
        message: "Bienvenue sur l'API de mymind" 
    });
});

// Lancement
app.listen(PORT, () => {
    console.log(`Server mymind running on http://localhost:${PORT}`);
});