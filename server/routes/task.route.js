const express = require('express');
const router = express.Router();

// Importation des fonctions logiques depuis le contrôleur
const { 
    getTaskById, 
    createTask, 
    updateTask, 
    deleteTask,
    getProjectByTaskId 
} = require('../controllers/task.controller.js');

// GET /api/tasks/:id - Récupérer une tâche par son ID
router.get('/:id', getTaskById);

router.post('/', createTask);

router.put('/:id', updateTask);

router.delete('/:id', deleteTask);

// GET /api/tasks/:id/project - Récupérer le projet associé à cette tâche
router.get('/:id/project', getProjectByTaskId);

module.exports = router;