const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');

const {
    getAllProjects,
    getProjectById,
    createProject,
    deleteProject,
    updateProject,
    addUserToProject,
    addTaskToProject,
    getTasksByProjectId,
    getUsersByProjectId
} = require('../controllers/project.controller');

router.get('/', authenticate, getAllProjects);
router.get('/:id', authenticate, getProjectById);
router.post('/', authenticate, createProject);
router.delete('/:id', authenticate, deleteProject);
router.put('/:id', authenticate, updateProject);
router.post('/:id/users', authenticate, addUserToProject);
router.post('/:id/tasks', authenticate, addTaskToProject);
router.get('/:id/tasks', authenticate, getTasksByProjectId);
router.get('/:id/users', authenticate, getUsersByProjectId);

module.exports = router;