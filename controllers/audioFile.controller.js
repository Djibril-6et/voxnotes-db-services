const AudioFile = require('../models/audioFile.model');

// Add a new audio/video file
exports.uploadFile = async (req, res) => {
  try {
    const { userId, filePath, fileType, fileName, fileSize } = req.body;

    const newFile = new AudioFile({ userId, filePath, fileType, fileName, fileSize });
    await newFile.save();

    res.status(201).json({ message: 'File uploaded successfully', file: newFile });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a user's list audio/video files
exports.getUserFiles = async (req, res) => {
  try {
    const files = await AudioFile.find({ userId: req.params.userId });
    res.status(200).json(files);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a file by ID
exports.getFileById = async (req, res) => {
  try {
    const file = await AudioFile.findById(req.params.id);
    if (!file) return res.status(404).json({ message: 'File not found' });
    res.status(200).json(file);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};