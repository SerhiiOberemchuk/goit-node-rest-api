import multer from "multer";
import path from "path";

const tempDir = path.resolve("../", "tmp");

const multerConfig = multer.diskStorage({
  destination: tempDir,
  filename(reg, file, cb) {
    cb(null, file.originalname);
  },
});

export const upload = multer({
  storage: multerConfig,
});

// module.exports = upload;
