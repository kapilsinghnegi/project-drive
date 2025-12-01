const fileModel = require("../models/files.models");
const supabase = require("../config/supabaseClient");

// GET ALL FILES
exports.getFiles = async (req, res) => {
  try {
    const files = await fileModel
      .find({ user: req.user.userId })
      .sort({ createdAt: -1 });
    res.json({ files });
  } catch (err) {
    console.error("Fetch files error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// GET FILE BY ID
exports.getFileById = async (req, res) => {
  try {
    const file = await fileModel.findOne({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!file) return res.status(404).json({ message: "File not found" });

    res.json({ file });
  } catch (err) {
    console.error("Get file error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// DOWNLOAD FILE
exports.downloadFile = async (req, res) => {
  try {
    const fileDoc = await fileModel.findOne({
      path: req.params.path,
      user: req.user.userId,
    });

    if (!fileDoc)
      return res.status(404).json({ message: "File not found / unauthorized" });

    const { data, error } = await supabase.storage
      .from("drive-storage")
      .download(fileDoc.path);

    if (error) {
      console.error("Supabase download error:", error);
      return res.status(500).json({ error: error.message });
    }

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${fileDoc.originalname}"`
    );
    res.setHeader("Content-Type", data.type || "application/octet-stream");

    const arrayBuffer = await data.arrayBuffer();

    res.send(Buffer.from(arrayBuffer));
  } catch (err) {
    console.error("Download error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// DELETE FILE
exports.deleteFile = async (req, res) => {
  try {
    const file = await fileModel.findOne({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!file) return res.status(404).json({ message: "File not found" });

    const { error } = await supabase.storage
      .from("drive-storage")
      .remove([file.path]);

    if (error) {
      console.error("Supabase delete error:", error);
      return res.status(500).json({ error: error.message });
    }

    await fileModel.deleteOne({ _id: req.params.id });

    res.json({ message: "File deleted successfully" });
  } catch (err) {
    console.error("Delete file error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
