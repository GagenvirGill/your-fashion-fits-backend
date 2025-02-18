// src/middleware/multerFileUpload.js
import multer, { diskStorage } from "multer";
import { extname } from "path";
import envConfig from "../config/envConfig.js";

const uploadFolder = envConfig.uploadsFolder;

const storage = diskStorage({
	destination: (req, file, cb) => {
		cb(null, uploadFolder);
	},
	filename: (req, file, cb) => {
		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
		cb(
			null,
			file.fieldname + "-" + uniqueSuffix + extname(file.originalname)
		);
	},
});

const upload = multer({
	storage: storage,
	limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB limit
});

export default upload;
