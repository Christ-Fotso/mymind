require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const enterpriseRoutes = require('./routes/enterprise.route');
const projectRoutes = require('./routes/project.route');
const taskRoutes = require('./routes/task.route');
const authRoutes = require('./routes/auth.route');
const userRoutes = require('./routes/user.route');

const app = express();
const PORT = 5000;

// Configuration CORS pour accepter les cookies
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.json({ 
    project: "mymind",
    status: "online", 
    message: "Bienvenue sur l'API de mymind" 
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/enterprises', enterpriseRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

app.listen(PORT, () => {
  console.log(`Server mymind running on http://localhost:${PORT}`);
});
