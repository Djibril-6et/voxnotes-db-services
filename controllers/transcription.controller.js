const Transcription = require("../models/transcription.model");

// Create a new transcription for an audio/video file
exports.createTranscription = async (req, res) => {
  try {
    const {
      audioFileId,
      userId,
      transcriptionText,
      language,
      status,
      errorDetails,
    } = req.body;

    const newTranscription = new Transcription({
      audioFileId,
      userId,
      transcriptionText,
      language,
      status,
      errorDetails,
    });

    await newTranscription.save();

    res.status(201).json({
      message: "Transcription created successfully",
      transcription: newTranscription,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a user's transcription
exports.getUserTranscriptions = async (req, res) => {
  try {
    const transcriptions = await Transcription.find({
      userId: req.params.userId,
    });
    res.status(200).json(transcriptions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a transcription by ID
exports.getTranscriptionById = async (req, res) => {
  try {
    const transcription = await Transcription.findById(req.params.id);
    if (!transcription)
      return res.status(404).json({ message: "Transcription not found" });
    res.status(200).json(transcription);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
