const express = require('express');
const router = express.Router();
const { exportTableToJson } = require('../services/exportService');
const tableController = require('../controllers/table');
const membersController = require('../controllers/members');
const projectsController = require('../controllers/projects');

router.get('/members/listMembers', membersController.getMemberList);
router.get('/projects/listProjects', projectsController.getProjectList);

// Route to generate JSON file from a table
router.get('/table/:tableName', tableController.getTableContents);
router.get('/members/:memberId', membersController.getMember);
router.get('/projects/:projectId', projectsController.getProject);

module.exports = router;