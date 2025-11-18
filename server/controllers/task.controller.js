const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// --- 1. Récupérer toutes les tâches d'un projet spécifique ---
const getTasksByProject = async (req, res) => {
    try {
        // Supposons que l'ID du projet est passé dans les paramètres de l'URL
        const { projectId } = req.params;
        
        // Vérification de l'existence du projet (facultatif mais bonne pratique)
        const project = await prisma.project.findUnique({ where: { id: projectId } });
        if (!project) {
            return res.status(404).json({ error: "Projet non trouvé" });
        }

        const tasks = await prisma.task.findMany({
            where: { projectId: projectId },
            // Inclure les commentaires ou l'utilisateur assigné si nécessaire
            include: { comments: true } 
        });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// --- 2. Récupérer une tâche par ID ---
const getTaskById = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await prisma.task.findUnique({
            where: { id: id },
            include: { comments: true } // Inclure les commentaires associés
        });

        if (!task) {
            return res.status(404).json({ error: "Tâche non trouvée" });
        }
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// --- 3. Créer une nouvelle tâche ---
const createTask = async (req, res) => {
    try {
        // projectId est requis pour lier la tâche au projet
        const { title, description, dueDate, projectId } = req.body; 

        if (!title || !projectId) {
            return res.status(400).json({ error: "Titre et ID du projet sont requis" });
        }

        const newTask = await prisma.task.create({
            data: {
                title,
                description,
                dueDate: dueDate ? new Date(dueDate) : null, // Convertir la date si elle existe
                projectId,
                // Le statut par défaut est défini dans le schéma Prisma ("PENDING")
            }
        });
        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// --- 4. Mettre à jour une tâche ---
const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        // Permet de mettre à jour le titre, la description, le statut, la date limite, etc.
        const { title, description, status, dueDate } = req.body; 

        const updatedTask = await prisma.task.update({
            where: { id: id },
            data: {
                title,
                description,
                status,
                dueDate: dueDate ? new Date(dueDate) : undefined, // undefined pour ignorer si non fourni
                updatedAt: new Date()
            }
        });
        res.status(200).json(updatedTask);
    } catch (error) {
        // Gérer l'erreur si l'ID n'est pas trouvé (P2025 de Prisma)
        if (error.code === 'P2025') {
            return res.status(404).json({ error: "Tâche non trouvée" });
        }
        res.status(500).json({ error: error.message });
    }
};

// --- 5. Supprimer une tâche ---
const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.task.delete({
            where: { id: id }
        });
        res.status(204).send(); // 204 No Content pour une suppression réussie
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: "Tâche non trouvée" });
        }
        res.status(500).json({ error: error.message });
    }
};


module.exports = {
    getTasksByProject,
    getTaskById,
    createTask,
    updateTask,
    deleteTask
};