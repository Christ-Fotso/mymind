const express = require('express');
const router = express.Router();

// Assurez-vous que le chemin du contrôleur est correct (notif.controller.js vs notification.controller.js)
const { 
    getNotificationsByUser,
    markNotificationAsRead,
    markAllNotificationsAsRead
} = require('../controllers/notif.controller.js'); 


// Toutes ces routes devraient être protégées par un middleware d'authentification (JWT)
// pour garantir que 'userId' est bien celui de l'utilisateur connecté.

// GET /api/notifications/user/:userId - Récupérer toutes les notifications pour un utilisateur
// Dans l'implémentation finale, remplacez ':userId' par l'ID extrait du jeton JWT.
router.get('/user/:userId', getNotificationsByUser);

// PUT /api/notifications/:id/read - Marquer une seule notification comme lue
router.put('/:id/read', markNotificationAsRead);

// PUT /api/notifications/user/:userId/read-all - Marquer TOUTES les notifications d'un utilisateur comme lues
router.put('/user/:userId/read-all', markAllNotificationsAsRead);


module.exports = router;
