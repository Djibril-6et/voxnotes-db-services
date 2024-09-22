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
  const { transcription, userId, title } = req.body; // Récupérer la transcription et l'ID de l'utilisateur envoyés dans le body

  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: "AudioFiles",
    chunkSizeBytes: 256000,
  });

  const uploadStream = bucket.openUploadStream(req.file.originalname, {
    metadata: { 
      mimetype: req.file.mimetype,
      transcription: transcription || "", // Ajouter la transcription
      userId: userId || "", // Ajouter l'ID de l'utilisateur,
      title : title || "",
    },
  });

  uploadStream.end(req.file.buffer);

  uploadStream.on("finish", () => {
    res.status(201).json({
      message: "Audio file uploaded successfully",
      fileId: uploadStream.id,
    });
  });

  uploadStream.on("error", (err) => {
    res.status(500).json({
      message: "Error uploading audio file",
      error: err.message,
    });
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

exports.getUserAudioFiles = async (req, res) => {
  try {
    const { userId } = req.params;

    const files = await mongoose.connection.db.collection("AudioFiles.files").find({
      "metadata.userId": userId
    }).toArray();

    console.log("Files found:", files); // Afficher les fichiers trouvés pour débogage

    if (files.length === 0) {
      return res.status(404).json({ message: "Aucun fichier audio trouvé pour cet utilisateur" });
    }

    res.status(200).json(files);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération des fichiers", error: err.message });
  }
};

exports.getFileMetadataById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Received ID from request params:", id); // Log de l'ID reçu

    // Vérification que l'ID est valide et conversion en ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid file ID format" });
    }

    const objectId = new mongoose.Types.ObjectId(id);
    console.log("Converted ObjectId:", objectId); // Log de l'ObjectId converti

    // Recherche dans la collection "AudioFiles.files"
    const file = await mongoose.connection.db.collection("AudioFiles.files").findOne({
      _id: objectId
    });

    console.log("File found:", file); // Log du fichier trouvé ou non

    // Si le fichier n'existe pas
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    // Retourner les métadonnées du fichier
    res.status(200).json(file);
  } catch (err) {
    console.error("Error during file retrieval:", err); // Log de l'erreur
    res.status(500).json({ message: "Error retrieving file metadata", error: err.message });
  }
};