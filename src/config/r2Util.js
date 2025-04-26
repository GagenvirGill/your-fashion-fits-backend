// src/config/r2Upload.js
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import r2Client from "./r2Client.js";
import { extname } from "path";
import envConfig from "./envConfig.js";

export const r2Upload = async (file) => {
	const fileExt = extname(file.originalname);
	const key = `items/${Date.now()}-${Math.random()
		.toString(36)
		.slice(2)}${fileExt}`;

	const uploadParams = {
		Bucket: envConfig.r2BucketName,
		Key: key,
		Body: file.buffer,
		ContentType: file.mimetype,
	};

	await r2Client.send(new PutObjectCommand(uploadParams));

	return `${envConfig.r2URL}/${key}`;
};

export const r2Delete = async (key) => {
	const deleteParams = {
		Bucket: envConfig.r2BucketName,
		Key: key,
	};

	await r2Client.send(new DeleteObjectCommand(deleteParams));
};
