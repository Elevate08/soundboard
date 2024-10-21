// Import necessary modules
import fs from "node:fs";
import path from "node:path";
import express from "npm:express";
import multer from "npm:multer";

// Create Express app
const app = express();

// Define the path to the sounds directory
const __dirname = path.resolve(); // In ESM, there's no __dirname, so we define it
const publicDirectory = path.join(__dirname, "public");
const soundsDirectory = path.join(publicDirectory, "sounds");

// Serve static files from the sounds directory
app.use("/sounds", express.static(soundsDirectory));
app.use(express.static(publicDirectory));

// Configure multer for file uploads (storing files in the 'public/audio' directory)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, soundsDirectory); // Destination for saving uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Keep original file name
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /mp3|wav|ogg/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase(),
    );
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error("Only audio files are allowed!"));
    }
  },
});

// Endpoint to upload audio files
app.post("/upload-audio", upload.single("audioFile"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  res.status(200).send("File uploaded successfully.");
});

// Endpoint to list sounds files
app.get("/sounds-files", (req, res) => {
  fs.readdir(soundsDirectory, (err, files) => {
    if (err) {
      return res.status(500).send("Unable to scan directory");
    }
    // Filter sounds files with .mp3 or .wav extension
    const soundsFiles = files.filter(
      (file) => file.endsWith(".mp3") || file.endsWith(".wav"),
    );
    res.json(soundsFiles); // Send the list of files to the client
  });
});

// Start the server
app.listen(8000, () => {
  console.log("Server running on http://localhost:8000");
});
