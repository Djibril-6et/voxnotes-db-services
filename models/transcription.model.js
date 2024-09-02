const mongoose = require('mongoose');

const TranscriptionSchema = new mongoose.Schema({
  audioFileId: { type: mongoose.Schema.Types.ObjectId, ref: 'AudioFile', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  transcriptionText: { type: String, required: true },
  language: { type: String, default: 'en' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['completed', 'in-review', 'error'], default: 'completed' },
  errorDetails: { type: String }
});

module.exports = mongoose.model('Transcription', TranscriptionSchema);