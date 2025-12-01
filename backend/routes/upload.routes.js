const express = require("express");
const upload = require("../config/multer.config");
const auth = require("../middlewares/auth");
const fileModel = require("../models/files.models");
const supabase = require("../config/supabaseClient");

const router = express.Router();

router.post("/", auth, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const fileName = `${Date.now()}_${req.file.originalname}`;

    const { data, error } = await supabase.storage
      .from("drive-storage")
      .upload(fileName, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: true,
      });

    if (error) {
      console.error("Supabase upload error:", error);
      return res.status(500).json({ error: error.message });
    }

    const newFile = await fileModel.create({
      path: data.path,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: Math.round(req.file.size / 1024),
      user: req.user.userId,
    });

    res.json({ message: "Uploaded successfully", file: newFile });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
