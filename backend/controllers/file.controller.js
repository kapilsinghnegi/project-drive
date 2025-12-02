const fileModel = require("../models/files.models");
const SharedLink = require("../models/sharedLink.model");
const supabase = require("../config/supabaseClient");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const bcrypt = require("bcrypt");

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
// SHARE FILE
exports.shareFile = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, password, expiresIn } = req.body; // expiresIn in hours

    const file = await fileModel.findOne({
      _id: id,
      user: req.user.userId,
    });

    if (!file) return res.status(404).json({ message: "File not found" });

    // Generate unique link ID
    const linkId = crypto.randomBytes(16).toString("hex");

    // Hash password if provided
    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // Calculate expiration date
    let expiresAt = null;
    if (expiresIn) {
      expiresAt = new Date(Date.now() + expiresIn * 60 * 60 * 1000);
    }

    // Create shared link
    const sharedLink = await SharedLink.create({
      fileId: file._id,
      linkId,
      password: hashedPassword,
      expiresAt,
      createdBy: req.user.userId,
    });

    // Send email if provided
    if (email) {
      const transporter = nodemailer.createTransporter({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: process.env.EMAIL_SECURE === "true",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const shareUrl = `${
        process.env.FRONTEND_URL || "http://localhost:5173"
      }/shared/${linkId}`;

      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: `${req.user.username} shared a file with you`,
        html: `
          <p>${req.user.username} shared a file with you: <strong>${
          file.originalname
        }</strong></p>
          <p><a href="${shareUrl}">Click here to access the file</a></p>
          ${password ? "<p>This link is password protected.</p>" : ""}
          ${
            expiresAt
              ? `<p>This link expires on ${expiresAt.toLocaleDateString()}.</p>`
              : ""
          }
        `,
      });
    }

    res.json({
      message: "File shared successfully",
      shareUrl: `${
        process.env.FRONTEND_URL || "http://localhost:5173"
      }/shared/${linkId}`,
    });
  } catch (err) {
    console.error("Share file error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ACCESS SHARED FILE
exports.accessSharedFile = async (req, res) => {
  try {
    const { linkId } = req.params;
    const { password } = req.body;

    const sharedLink = await SharedLink.findOne({ linkId }).populate("fileId");

    if (!sharedLink) {
      return res.status(404).json({ message: "Shared link not found" });
    }

    // Check expiration
    if (sharedLink.expiresAt && sharedLink.expiresAt < new Date()) {
      return res.status(410).json({ message: "Shared link has expired" });
    }

    // Check password
    if (sharedLink.password) {
      if (!password) {
        return res.status(401).json({ message: "Password required" });
      }
      const isValidPassword = await bcrypt.compare(
        password,
        sharedLink.password
      );
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid password" });
      }
    }

    const file = sharedLink.fileId;

    // Download file from Supabase
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
  } catch (err) {
    console.error("Access shared file error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
