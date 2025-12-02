const supabase = require("../config/supabaseClient");
const fileModel = require("../models/files.models");

// UPLOAD FILE
exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const uniqueName = `${Date.now()}_${req.file.originalname}`;

    const { data, error } = await supabase.storage
      .from("drive-storage")
      .upload(uniqueName, req.file.buffer, {
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

    res.json({
      message: "File uploaded successfully",
      file: newFile,
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
