const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');

const {
    getAllEnterprises,
    getEnterpriseById,
    createEnterprise,
    deleteEnterprise,
    updateEnterprise,
    addUserToEnterprise,
    addProjectToEnterprise,
    getProjectsByEnterpriseId,
    getUsersByEnterpriseId
} = require('../controllers/enterprise.controller');

router.get('/', authenticate, getAllEnterprises);
router.get('/:id', authenticate, getEnterpriseById);
router.post('/', authenticate, createEnterprise);
router.delete('/:id', authenticate, deleteEnterprise);
router.put('/:id', authenticate, updateEnterprise);
router.post('/:id/users', authenticate, addUserToEnterprise);
router.post('/:id/projects', authenticate, addProjectToEnterprise);
router.get('/:id/projects', authenticate, getProjectsByEnterpriseId);
router.get('/:id/users', authenticate, getUsersByEnterpriseId);


module.exports = router;