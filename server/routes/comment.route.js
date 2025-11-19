const express = require('express');
const router = express.Router();

// Importation des fonctions logiques depuis le contrôleur
const { 
    getCommentsByTask,
    createComment, 
    updateComment, 
    deleteComment 
} = require('../controllers/comment.controller.js');


// La récupération de tous les commentaires nécessite l'ID de la tâche.
// Nous allons supposer que vous allez monter cette route sous la route 'tasks' ou que l'ID est dans l'URL.

// Si vous voulez que la route soit /api/comments/task/:taskId
router.get('/task/:taskId', getCommentsByTask);

router.post('/', createComment);

router.put('/:id', updateComment);

router.delete('/:id', deleteComment);


module.exports = router;