// src/middleware/corsMiddleware.js
import cors from "cors";

const corsMiddleware = cors({
	origin: "http://localhost:5173",
	credentials: true,
	allowedHeaders: ["Content-Type", "Authorization"],
});

export default corsMiddleware;
