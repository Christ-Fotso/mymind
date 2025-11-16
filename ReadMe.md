Enum role
    superadmin
    admin
    manager
    custumer
    
classe
-user
    uid 
    fisrtname
    lastname
    mail
    role
    uid_enterprise optional

-enterprise
    uid
    Name

-project
    uid
    enterprise_uid
    creator
    name
    description
    status
    users[]

-task
    uid
    project_uid optional
    name
    status
    priority
    deadline time
    users[]

comment
    uid
    content
    user_uid
    task_uid

Notification
    uid
    content
    task_uid
    trigger
    status

# Créer le dossier backend
mkdir server
cd server
npm init -y
npm install express cors nodemon dotenv

Créez le fichier server/index.js avec ce contenu de base :

JavaScript

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

C'est noté ! Voici la procédure adaptée spécifiquement pour votre nouveau projet "mymind".

Nous allons créer une structure propre : un dossier racine mymind contenant un dossier client (React) et un dossier server (Express).

1. Création de l'architecture
Ouvrez votre terminal PowerShell et lancez ces commandes pour préparer le terrain :

PowerShell

# Créer le dossier racine du projet et y entrer
mkdir mymind
cd mymind

# Créer le dossier backend
mkdir server

# Créer le frontend avec Vite (nommé "client")
npm create vite@latest client -- --template react
2. Configuration du Backend (API)
On installe Express et de quoi faire communiquer les deux parties.

PowerShell

cd server
npm init -y
npm install express cors nodemon dotenv
Créez le fichier server/index.js avec ce contenu de base :

JavaScript

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
Ajoutez ensuite le script de développement dans le fichier server/package.json (section "scripts") :

JSON

"scripts": {
  "start": "node index.js",
  "dev": "nodemon index.js"
}

# Créer le dossier frontend
# Créer le frontend avec Vite (nommé "client")
npm create vite@latest client -- --template react

