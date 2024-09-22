const express = require('express');
const router = express.Router();
const audioFileController = require('../controllers/audioFile.controller');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/', audioFileController.uploadFile);
router.post('/uploadfile',  upload.single('file'), audioFileController.uploadAudioFile);
router.get('/file/:fileId', audioFileController.downloadAudioFile);
router.get('/user/:userId', audioFileController.getUserAudioFiles);
router.get('/:id', audioFileController.getFileById);
router.get('/:id/metadata', audioFileController.getFileMetadataById);

module.exports = router;