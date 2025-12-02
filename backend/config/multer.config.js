const multer = require("multer");
const storage = multer.memoryStorage();

// Allow configuring max file size via env (in MB), default 20 MB
const maxFileSizeMb = Number(process.env.MAX_FILE_SIZE_MB || 20);

const upload = multer({
  storage,
  limits: {
    fileSize: maxFileSizeMb * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    cb(null, true);
  },
});

module.exports = upload;
