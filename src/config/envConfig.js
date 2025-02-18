// src/config/envConfig.js
import dotenv from "dotenv";
dotenv.config();

const envConfig = {
	serverPort: process.env.SERVER_PORT,

	uploadsFolder: process.env.UPLOADS_FOLDER,

	dbName: process.env.DB_NAME,
	dbUser: process.env.DB_USER,
	dbPassword: process.env.DB_PASSWORD,
	dbHost: process.env.DB_HOST,
	dbPort: process.env.DB_PORT || 5432,
};

if (process.env.DB_ENV === "test") {
	config.dbName = TEST_DB_NAME;
}

export default envConfig;
