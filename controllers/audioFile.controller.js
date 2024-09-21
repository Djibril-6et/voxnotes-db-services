const AudioFile = require("../models/audioFile.model");
const mongoose = require("mongoose");

// Add a new audio/video file
exports.uploadFile = async (req, res) => {
  try {
    const { userId, filePath, fileType, fileName, fileSize } = req.body;

    const newFile = new AudioFile({
      userId,
      filePath,
      fileType,
      fileName,
      fileSize,
    });
    await newFile.save();

    res
      .status(201)
      .json({ message: "Audio file uploaded successfully", file: newFile });
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
    if (!file) return res.status(404).json({ message: "Audio file not found" });
    res.status(200).json(file);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.uploadAudioFile = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: "AudioFiles",
    chunkSizeBytes: 256000,
  });

  const uploadStream = bucket.openUploadStream(req.file.originalname, {
    metadata: { mimetype: req.file.mimetype },
  });

  uploadStream.end(req.file.buffer);

  uploadStream.on("finish", () => {
    res.status(201).json({
      message: "Audio file uploaded successfully",
      fileId: uploadStream.id,
    });
  });

  uploadStream.on("error", (err) => {
    res
      .status(500)
      .json({ message: "Error uploading audio file", error: err.message });
  });
};

// Handle file download
exports.downloadAudioFile = (req, res) => {
  const { fileId } = req.params;

  const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: "AudioFiles",
  });
  const objectId = new mongoose.Types.ObjectId(fileId);

  bucket
    .openDownloadStream(objectId)
    .on("data", (chunk) => {
      res.write(chunk);
    })
    .on("end", () => {
      res.end();
    })
    .on("error", (err) => {
      res
        .status(404)
        .json({ message: "Audio file not found", error: err.message });
    });
};