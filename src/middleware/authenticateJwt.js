// src/middleware/authenticate.js
import jwt from "jsonwebtoken";
import envConfig from "../config/envConfig.js";

const authenticateJWT = (req, res, next) => {
	const token = req.headers.authorization?.split(" ")[1];

	if (!token) {
		return res.status(401).json({ message: "No token provided" });
	}

	jwt.verify(token, envConfig.jwtSecret, (err, decoded) => {
		if (err) {
			return res
				.status(403)
				.json({ message: "Invalid or expired token" });
		}

		req.user = { userId: decoded.sub };
		next();
	});
};

export default authenticateJWT;
