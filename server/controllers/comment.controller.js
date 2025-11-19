const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

// --- 1. Récupérer tous les commentaires d'une tâche ---
const getCommentsByTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        
        // Vérification de l'existence de la tâche
        const task = await prisma.task.findUnique({ where: { id: taskId } });
        if (!task) {
            return res.status(404).json({ error: "Tâche non trouvée" });
        }
        
        const comments = await prisma.comment.findMany({
            where: { taskId: taskId },
            // Trier par date de création (du plus ancien au plus récent)
            orderBy: { createdAt: 'asc' }, 
            // Inclure l'utilisateur qui a posté le commentaire
            include: { user: { select: { id: true, firstName: true, lastName: true } } } 
        });
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// --- 2. Créer un nouveau commentaire ---
const createComment = async (req, res) => {
    try {
        const { content, taskId } = req.body;
        // Supposons que l'ID de l'utilisateur (userId) est extrait du jeton JWT (middleware d'authentification)
        // Pour cet exemple, nous allons le prendre directement du body ou simuler un ID utilisateur.
        // **À faire plus tard :** Extraire `userId` de `req.user` après authentification JWT.
        const { userId } = req.body; // À remplacer par req.user.id dans l'implémentation finale

        if (!content || !taskId || !userId) {
            return res.status(400).json({ error: "Contenu, ID de la tâche et ID de l'utilisateur sont requis" });
        }

        const newComment = await prisma.comment.create({
            data: {
                content,
                taskId,
                userId
            }
        });
        res.status(201).json(newComment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// --- 3. Mettre à jour un commentaire (Optionnel : souvent utilisé pour la correction) ---
const updateComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body; 

        if (!content) {
            return res.status(400).json({ error: "Le contenu du commentaire est requis pour la mise à jour" });
        }
        
        const updatedComment = await prisma.comment.update({
            where: { id: id },
            data: { content }
        });
        res.status(200).json(updatedComment);
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: "Commentaire non trouvé" });
        }
        res.status(500).json({ error: error.message });
    }
};

// --- 4. Supprimer un commentaire ---
const deleteComment = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.comment.delete({
            where: { id: id }
        });
        res.status(204).send();
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: "Commentaire non trouvé" });
        }
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getCommentsByTask,
    createComment,
    updateComment,
    deleteComment
};