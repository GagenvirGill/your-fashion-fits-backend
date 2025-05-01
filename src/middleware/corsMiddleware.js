// src/middleware/corsMiddleware.js
import cors from "cors";
import envConfig from "../config/envConfig";

const corsMiddleware = cors({
	origin: `https://${frontendUrl}`,
	credentials: true,
	allowedHeaders: ["Content-Type", "Authorization"],
});

export default corsMiddleware;
