const express = require('express');
const router = express.Router();
const {
  getTasksByProject,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
} = require('../controllers/task.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.get('/project/:projectId', authenticate, getTasksByProject);
router.get('/:id', authenticate, getTaskById);
router.post('/', authenticate, createTask);
router.put('/:id', authenticate, updateTask);
router.delete('/:id', authenticate, deleteTask);

module.exports = router;

