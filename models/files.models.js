const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  path: {
    type: String,
    required: [true, "Path is required"],
  },
  originalname: {
    type: String,
    required: [true, "Originalname is required"],
  },
  mimetype: {
    type: String,
    required: [true, "Mimetype is required"],
  },
  size: {
    type: Number,
    required: [true, "Size is required"],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: [true, "User is required"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const fileModel = mongoose.model("files", fileSchema);
module.exports = fileModel;
