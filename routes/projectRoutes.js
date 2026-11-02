const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

// Routes pour /api/projects
router.get('/', projectController.getAllProjects);
router.post('/', projectController.createProject);

// Routes pour /api/projects/:id
router.get('/:id', projectController.getProjectById);
router.put('/:id', projectController.updateProject);
router.delete('/:id', projectController.deleteProject);

module.exports = router;