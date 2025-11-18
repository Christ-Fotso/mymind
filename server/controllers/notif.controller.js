const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// --- 1. Récupérer toutes les notifications d'un utilisateur ---
const getNotificationsByUser = async (req, res) => {
    try {
        // Supposons que l'ID de l'utilisateur est extrait de l'authentification
        // **À faire plus tard :** Extraire `userId` de `req.user` après authentification JWT.
        const { userId } = req.params; // ou req.user.id

        const notifications = await prisma.notification.findMany({
            where: { userId: userId },
            // Trier par date de création (du plus récent au plus ancien)
            orderBy: { createdAt: 'desc' } 
        });
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// --- 2. Marquer une notification comme lue ---
const markNotificationAsRead = async (req, res) => {
    try {
        const { id } = req.params;

        const updatedNotification = await prisma.notification.update({
            where: { id: id },
            data: { isRead: true }
        });
        res.status(200).json(updatedNotification);
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: "Notification non trouvée" });
        }
        res.status(500).json({ error: error.message });
    }
};

// --- 3. Marquer toutes les notifications d'un utilisateur comme lues ---
const markAllNotificationsAsRead = async (req, res) => {
    try {
        // Supposons que l'ID de l'utilisateur est extrait de l'authentification
        const { userId } = req.params; // ou req.user.id
        
        // `updateMany` pour modifier plusieurs enregistrements à la fois
        const result = await prisma.notification.updateMany({
            where: { 
                userId: userId,
                isRead: false // Ne met à jour que celles qui ne sont pas encore lues
            },
            data: { isRead: true }
        });
        // Renvoie le nombre de notifications mises à jour
        res.status(200).json({ count: result.count, message: `${result.count} notifications marquées comme lues.` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// **Note sur la création de notifications :** // La création de notifications est généralement déclenchée par des événements dans d'autres contrôleurs (ex: createTask, createComment, updateTask).
// Par exemple, après la création d'une tâche, le contrôleur `task.controller.js` pourrait appeler une fonction utilitaire pour créer la notification.
// Nous n'incluons donc pas de `createNotification` ici, mais une fonction utilitaire serait nécessaire pour cela.

module.exports = {
    getNotificationsByUser,
    markNotificationAsRead,
    markAllNotificationsAsRead
};