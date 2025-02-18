// src/server.js
import app from "./app.js";
import sequelize from "./config/db.js";
import envConfig from "./config/envConfig.js";
import "./models/index.js";

const startServer = async () => {
	try {
		console.log("Models Created, starting Sequelize Sync");
		await sequelize.sync({ alter: true });
		console.log("Sequelize Sync Successful");
		console.log("Registered models:", Object.keys(sequelize.models));

		app.listen(envConfig.serverPort, () => {
			console.log(
				`Server is running on http://localhost:${envConfig.serverPort}`
			);
		});
	} catch (error) {
		console.error("Failed to start server:", error.message);
		process.exit(1);
	}
};

startServer();
