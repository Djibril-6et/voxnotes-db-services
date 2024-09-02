const mongoose = require('mongoose');

const AudioFileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  filePath: { type: String, required: true },
  fileType: { type: String, enum: ['audio', 'video'], required: true },
  fileName: { type: String, required: true },
  fileSize: { type: Number, required: true },
  uploadDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending', 'processing', 'completed', 'failed'], default: 'pending' },
  transcriptionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Transcription' }
});

module.exports = mongoose.model('AudioFile', AudioFileSchema);