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
    const mimetypes = /audio\/(mpeg|wav|ogg)/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase(),
    );
    const mimetype = mimetypes.test(file.mimetype);
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

app.get("/dynamic-styles.css", (req, res) => {
  const backgroundColor = process.env.background_color || "#023e8a"; // Default color
  const fontColor = process.env.font_color || "#caf0f8"; // Default color
  const uploadBackgroundColor =
    process.env.upload_background_color || "#0077b6"; // Default color
  const buttonBackgroundColor =
    process.env.button_background_color || "#0077b6"; // Default color
  const buttonFontColor = process.env.button_font_color || "#caf0f8"; // Default color
  const buttonBorderColor = process.env.button_border_color || "#00b4d8"; // Default color

  // Set the content type to CSS
  res.setHeader("Content-Type", "text/css");

  // Generate CSS dynamically
  res.send(`
        body {
          background: ${backgroundColor};
          width: auto;
          height: auto;
          color: ${fontColor};
        }
        body > h1 {
          text-align: center;
        }
        
        form {
          flex: 1 1 auto;
          width: fit-content;
          text-align: center;
          font-size: 40px;
          background: ${uploadBackgroundColor};
          border-radius: 10px;
          border: 1px solid;
          margin: 3px;
          padding-top: 3px;
          padding-bottom: 7px;
          padding-left: 10px;
          padding-right: 10px;
        }
        form > #fileInput {
          font-size: 30px;
        }
        
        form > button {
          font-size: 30px;
        }
        
        #sounds-buttons {
          display: grid;
          column-gap: 3px;
          row-gap: 3px;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
        }
        
        #sounds-buttons > button {
          margin: 0 auto;
          text-align: center;
          font-size: 30px;
          width: 400px;
          height: 200px;
          background: ${buttonBackgroundColor};
          border-radius: 10px;
          border: 3px solid;
          margin: 3px;
          align-items: center;
          justify-content: center;
          color: ${buttonFontColor};
          border-color: ${buttonBorderColor};
        }
    `);
});

// Start the server
app.listen(8000, () => {
  console.log("Server running on http://localhost:8000");
});
