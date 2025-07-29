const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

// Ensure 'uploads' folder exists
if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).send("No file uploaded.");
  const fileUrl = `${req.protocol}://${req.get("host")}/file/${req.file.filename}`;
  res.send(`Uploaded! Link: <a href="${fileUrl}">${fileUrl}</a>`);
});

app.get("/file/:filename", (req, res) => {
  const filePath = path.join(__dirname, "uploads", req.params.filename);
  if (fs.existsSync(filePath)) res.sendFile(filePath);
  else res.status(404).send("File not found");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
