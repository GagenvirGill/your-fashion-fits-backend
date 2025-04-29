// src/middleware/corsMiddleware.js
import cors from "cors";

const corsMiddleware = cors({
	origin: "https://your-fashion-fits-frontend.vercel.app",
	credentials: true,
	allowedHeaders: ["Content-Type", "Authorization"],
});

export default corsMiddleware;
