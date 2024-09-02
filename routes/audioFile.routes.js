const express = require('express');
const router = express.Router();
const audioFileController = require('../controllers/audioFile.controller');

router.post('/', audioFileController.uploadFile);
router.get('/user/:userId', audioFileController.getUserFiles);
router.get('/:id', audioFileController.getFileById);

module.exports = router;