const mongoose = require("mongoose");

const sharedLinkSchema = new mongoose.Schema({
  fileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "files",
    required: [true, "File ID is required"],
  },
  linkId: {
    type: String,
    required: [true, "Link ID is required"],
    unique: true,
  },
  password: {
    type: String,
    default: null, // Optional password
  },
  expiresAt: {
    type: Date,
    default: null, // Optional expiration
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: [true, "Creator is required"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const SharedLink = mongoose.model("SharedLink", sharedLinkSchema);
module.exports = SharedLink;
