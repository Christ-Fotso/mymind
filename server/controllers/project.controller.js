const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs'); 

const getAllProjects = async (req, res) => {
    try {
        const projects = await prisma.project.findMany();
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getProjectById = async (req, res) => {
    try {
        const { id } = req.params;
        const project = await prisma.project.findUnique({
            where: { id: id }
        });
        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createProject = async (req, res) => {
    try {
        const { name, description, creatorId, enterpriseId } = req.body;
        const project = await prisma.project.create({
            data: { name, description, creatorId, enterpriseId }
        });
        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;
        const project = await prisma.project.delete({
            where: { id: id }
        });
        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, creatorId, enterpriseId } = req.body;
        const project = await prisma.project.update({
            where: { id: id },
            data: { name, description, creatorId, enterpriseId }
        });
        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const addUserToProject = async (req, res) => {
    try {
        const { projectId, userId } = req.body;
        const project = await prisma.project.update({
            where: { id: projectId },
            data: { users: { connect: { id: userId } } }
        });
    }catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const addTaskToProject = async (req, res) => {
    try {
        const { projectId, taskId } = req.body;
        const project = await prisma.project.update({
            where: { id: projectId },
            data: { tasks: { connect: { id: taskId } } }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getTasksByProjectId = async (req, res) => {
    try {
        const { id } = req.params;
        const tasks = await prisma.task.findMany({
            where: { projectId: id }
        });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getUsersByProjectId = async (req, res) => {
    try {
        const { id } = req.params;
        const users = await prisma.user.findMany({
            where: { projectId: id }
        });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllProjects,
    getProjectById,
    createProject,
    deleteProject,
    updateProject,
    addUserToProject,
    addTaskToProject,
    getTasksByProjectId,
    getUsersByProjectId
};