import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
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