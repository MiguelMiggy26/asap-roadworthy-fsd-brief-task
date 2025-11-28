const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.post('/login', controller.login);

router.get('/company', controller.authenticateToken, controller.getCompanies);
router.get('/job', controller.authenticateToken, controller.getJobs);
router.get('/attachment', controller.authenticateToken, controller.getAttachments);
router.post('/messages', controller.authenticateToken, controller.addMessage);

router.get('/attachment/file/:uuid', controller.getAttachmentFile);

module.exports = router;
