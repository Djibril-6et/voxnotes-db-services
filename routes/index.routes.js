const express = require('express');
const userRoutes = require('./user.routes');
const audioFileRoutes = require('./audioFile.routes');
const transcriptionRoutes = require('./transcription.routes');

const router = express.Router();

router.use('/users', userRoutes);
router.use('/audioFiles', audioFileRoutes);
router.use('/transcriptions', transcriptionRoutes);

module.exports = router;