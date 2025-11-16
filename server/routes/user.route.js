const express = require('express');
const router = express.Router();

// On importe les fonctions logiques depuis le contrôleur
const { 
    getAllUsers, 
    getUserById, 
    createUser 
} = require('../controllers/users.controller');

// Définition des URL
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.post('/', createUser);

module.exports = router;