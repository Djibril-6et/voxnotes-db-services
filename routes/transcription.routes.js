const express = require('express');
const router = express.Router();
const transcriptionController = require('../controllers/transcription.controller');

router.post('/', transcriptionController.createTranscription);
router.get('/user/:userId', transcriptionController.getUserTranscriptions);
router.get('/:id', transcriptionController.getTranscriptionById);

module.exports = router;