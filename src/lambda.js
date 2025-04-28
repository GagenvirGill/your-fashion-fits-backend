// src/lambda.js
import serverlessExpress from "@codegenie/serverless-express";
import app from "./app.js";
import sequelize from "./config/db.js";
import envConfig from "./config/envConfig.js";
import "./models/index.js";

const initializeDatabase = async () => {
	try {
		console.log("Models Created, starting Sequelize Sync");
		await sequelize.sync({ alter: true });
		console.log("Sequelize Sync Successful");
		console.log("Registered models:", Object.keys(sequelize.models));
	} catch (error) {
		console.error("Failed to initialize database:", error.message);
		throw error;
	}
};

let server;

const setup = async () => {
	await initializeDatabase();
	server = serverlessExpress({ app });
};

const setupPromise = setup();

export const handler = async (event, context) => {
	await setupPromise;
	return server(event, context);
};
