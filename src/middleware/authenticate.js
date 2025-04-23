// src/middleware/authenticate.js
import passport from "passport";

const ensureAuth = (req, res, next) => {
	if (req.isAuthenticated()) {
		return next();
	}

	res.status(401).json({ error: "Not authenticated" });
};

export default ensureAuth;
