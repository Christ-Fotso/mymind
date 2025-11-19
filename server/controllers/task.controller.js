const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');


// ---Récupérer une tâche par ID---
const getTaskById = async (req, res) => {
    try {
        const { id } = req.params;

        const task = await prisma.task.findUnique({
            where: { id },
            include: {
                comments: {
                    include: { user: true }
                },
                project: true,
                user: {   // L'utilisateur assigné
                    select: { id: true, firstName: true, lastName: true, email: true }
                }
            }
        });

        if (!task) return res.status(404).json({ error: "Tâche non trouvée" });

        res.status(200).json(task);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



// Créer une tâche
const createTask = async (req, res) => {
    try {
        const { title, description, dueDate, projectId, userId } = req.body;

        if (!title || !projectId) {
            return res.status(400).json({ error: "Titre et projectId sont requis" });
        }

        // Vérifier si l'utilisateur assigné existe (optionnel)
        if (userId) {
            const userExists = await prisma.user.findUnique({
                where: { id: userId }
            });
            if (!userExists) {
                return res.status(404).json({ error: "Utilisateur assigné non trouvé" });
            }
        }

        const newTask = await prisma.task.create({
            data: {
                title,
                description,
                projectId,
                userId,
                dueDate: dueDate ? new Date(dueDate) : null
            },
            include: {
                user: true
            }
        });

        res.status(201).json(newTask);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



// ---Mettre à jour une tâche---
const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, status, dueDate, userId } = req.body;

        // Vérifier si nouveau user assigné existe
        if (userId) {
            const userExists = await prisma.user.findUnique({
                where: { id: userId }
            });
            if (!userExists) {
                return res.status(404).json({ error: "Utilisateur assigné non trouvé" });
            }
        }

        const updatedTask = await prisma.task.update({
            where: { id },
            data: {
                title,
                description,
                status,
                userId,
                dueDate: dueDate ? new Date(dueDate) : undefined,
            },
            include: {
                user: true
            }
        });

        res.status(200).json(updatedTask);

    } catch (error) {
        if (error.code === "P2025") {
            return res.status(404).json({ error: "Tâche non trouvée" });
        }
        res.status(500).json({ error: error.message });
    }
};



// ---Supprimer une tâche---
const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.task.delete({ where: { id } });

        res.status(200).json({ message: "Tâche supprimée avec succès" });

    } catch (error) {
        if (error.code === "P2025") {
            return res.status(404).json({ error: "Tâche non trouvée" });
        }
        res.status(500).json({ error: error.message });
    }
};



// ---Obtenir le projet associé---
const getProjectByTaskId = async (req, res) => {
    try {
        const { id } = req.params;

        const task = await prisma.task.findUnique({
            where: { id },
            include: { project: true }
        });

        if (!task) return res.status(404).json({ error: "Tâche non trouvée" });

        res.status(200).json(task.project);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


module.exports = {
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    getProjectByTaskId
};
