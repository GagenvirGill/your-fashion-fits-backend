// src/middleware/multerFileUpload.js
import multer from "multer";

const upload = multer({
	storage: multer.memoryStorage(),
	limits: { fileSize: 1024 * 1024 }, // 1 MB limit
});

export default upload;
