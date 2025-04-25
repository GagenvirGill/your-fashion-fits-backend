// src/config/r2.js
import { S3Client } from "@aws-sdk/client-s3";
import envConfig from "./envConfig.js";

const r2Client = new S3Client({
	region: envConfig.r2Region,
	endpoint: `https://${envConfig.r2AccountId}.r2.cloudflarestorage.com`,
	credentials: {
		accessKeyId: envConfig.r2AccessKeyId,
		secretAccessKey: envConfig.r2SecretAccessKey,
	},
});

export default r2Client;
