// src/routes/serverUptimeRoutes.js
import { Router } from "express";
import envConfig from "../config/envConfig.js";

const router = Router();

router.get("/", (req, res) => {
	const token = req.query.token;
	if (token !== envConfig.healthToken) {
		return res.status(403).send("Forbidden");
	}
	res.status(200).send("OK");
});

export default router;
