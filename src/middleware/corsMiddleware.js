// src/middleware/corsMiddleware.js
import cors from "cors";
import envConfig from "../config/envConfig.js";

const corsMiddleware = cors({
	origin: `${envConfig.frontendUrl}`,
	credentials: true,
	allowedHeaders: ["Content-Type", "Authorization"],
});

export default corsMiddleware;
