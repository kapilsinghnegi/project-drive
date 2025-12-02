const express = require("express");
const auth = require("../middlewares/auth");
const fileModel = require("../models/files.models");
const supabase = require("../config/supabaseClient");
const {
  shareFile,
  accessSharedFile,
} = require("../controllers/file.controller");

const router = express.Router();

// GET ALL FILES
router.get("/", auth, async (req, res) => {
  try {
    const files = await fileModel.find({ user: req.user.userId });
    res.json({ files });
  } catch (error) {
    console.error("Fetch files error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DOWNLOAD FILE (declared before :id so /download/... doesn't match :id)
router.get("/download/:path", auth, async (req, res) => {
  try {
    const loggedUser = req.user.userId;
    const path = req.params.path;

    const file = await fileModel.findOne({ path, user: loggedUser });
    if (!file) return res.status(401).json({ message: "Unauthorized" });

    const { data, error } = await supabase.storage
      .from("drive-storage")
      .download(file.path);

    if (error) {
      console.error("Supabase download error:", error);
      return res.status(500).json({ error: error.message });
    }

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${file.originalname}"`
    );
    res.setHeader("Content-Type", data.type || "application/octet-stream");

    const arrayBuffer = await data.arrayBuffer();
    res.send(Buffer.from(arrayBuffer));
  } catch (error) {
    console.error("Download error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET FILE BY ID (for React FileView page)
router.get("/:id", auth, async (req, res) => {
  try {
    const file = await fileModel.findOne({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!file) return res.status(404).json({ message: "File not found" });

    res.json({ file });
  } catch (error) {
    console.error("Get file error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE FILE
router.delete("/:id", auth, async (req, res) => {
  try {
    const file = await fileModel.findOne({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!file) return res.status(404).json({ message: "File not found" });

    const { error: storageError } = await supabase.storage
      .from("drive-storage")
      .remove([file.path]);

    if (storageError) {
      console.error("Supabase delete error:", storageError);
      return res.status(500).json({ error: storageError.message });
    }

    await fileModel.deleteOne({ _id: req.params.id });

    res.json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// SHARE FILE
router.post("/share/:id", auth, shareFile);

// ACCESS SHARED FILE (no auth required)
router.get("/shared/:linkId", accessSharedFile);

module.exports = router;
