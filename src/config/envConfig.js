// src/config/envConfig/r2Client.js
import dotenv from "dotenv";
dotenv.config();

const envConfig = {
	serverPort: process.env.SERVER_PORT,

	dbName: process.env.DB_NAME,
	dbUser: process.env.DB_USER,
	dbPassword: process.env.DB_PASSWORD,
	dbHost: process.env.DB_HOST,
	dbPort: process.env.DB_PORT || 5432,

	supabaseHost: process.env.SUPABASE_HOST,
	supabasePort: process.env.SUPABASE_PORT,
	supabaseDb: process.env.SUPABASE_DB,
	supabasePassword: process.env.SUPABASE_PASSWORD,
	supabaseUser: process.env.SUPABASE_USER,

	googleClientId: process.env.GOOGLE_CLIENT_ID,
	googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,

	sessionSecret: process.env.SESSION_SECRET,

	r2AccessKeyId: process.env.R2_ACCESS_KEY_ID,
	r2SecretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
	r2BucketName: process.env.R2_BUCKET_NAME,
	r2AccountId: process.env.R2_ACCOUNT_ID,
	r2Region: process.env.R2_REGION,
	r2URL: process.env.R2_URL,

	backendUrl: process.env.BACKEND_URL,
};

if (process.env.DB_ENV === "test") {
	config.dbName = TEST_DB_NAME;
}

export default envConfig;
