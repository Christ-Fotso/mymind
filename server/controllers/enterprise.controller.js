const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

const getAllEnterprises = async (req, res) => {
    try {
        const enterprises = await prisma.enterprise.findMany();
        res.status(200).json(enterprises);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getEnterpriseById = async (req, res) => {
    try {
        const { id } = req.params;
        const enterprise = await prisma.enterprise.findUnique({
            where: { id: id }
        });
        res.status(200).json(enterprise);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getProjectsByEnterpriseId = async (req, res) => {
    try {
        const { id } = req.params;
        const projects = await prisma.project.findMany({
            where: { enterpriseId: id }
        });
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getUsersByEnterpriseId = async (req, res) => {
    try {
        const { id } = req.params;
        const users = await prisma.user.findMany({
            where: { enterpriseId: id }
        });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createEnterprise = async (req, res) => {
    try {
        const { name, address } = req.body;
        const newEnterprise = await prisma.enterprise.create({
            data: { name, address }
        });
        res.status(201).json(newEnterprise);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteEnterprise = async (req, res) => {
    try {
        const { id } = req.params;
        const enterprise = await prisma.enterprise.delete({
            where: { id: id }
        });
        res.status(200).json(enterprise);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateEnterprise = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, address } = req.body;
        const enterprise = await prisma.enterprise.update({
            where: { id: id },
            data: { name, address }
        });
        res.status(200).json(enterprise);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const addUserToEnterprise = async (req, res) => {
    try {
        const { enterpriseId, userId } = req.body;
        const enterprise = await prisma.enterprise.update({
            where: { id: enterpriseId },
            data: { users: { connect: { id: userId } } }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const addProjectToEnterprise = async (req, res) => {
    try {
        const { enterpriseId, projectId } = req.body;
        const enterprise = await prisma.enterprise.update({
            where: { id: enterpriseId },
            data: { projects: { connect: { id: projectId } } }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllEnterprises,
    getEnterpriseById,
    createEnterprise,
    deleteEnterprise,
    updateEnterprise,
    addUserToEnterprise,
    addProjectToEnterprise,
    getProjectsByEnterpriseId,
    getUsersByEnterpriseId
};