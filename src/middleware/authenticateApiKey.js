import envConfig from "../config/envConfig.js";

const authenticateApiKey = (req, res, next) => {
	const apiKey = req.headers["x-api-key"];

	if (!apiKey || apiKey !== envConfig.apiKey) {
		return res.status(401).json({ message: "Unauthorized" });
	}

	const userId = req.headers["x-user-id"];
	if (!userId) {
		return res.status(401).json({ message: "Missing user ID" });
	}

	req.user = { userId };
	next();
};

export default authenticateApiKey;
