// src/routes/authRoutes.js
import { Router } from "express";
import passport from "passport";
import envConfig from "../config/envConfig.js";

const router = Router();

router.get(
	"/google",
	passport.authenticate("google", {
		scope: ["profile", "email"],
	})
);

router.get(
	"/google/callback",
	passport.authenticate("google", {
		failureRedirect: envConfig.frontendUrl,
		session: false,
	}),
	(req, res) => {
		const { token } = req.user;
		res.send(`
			<html>
				<body>
					<script>
						window.opener.postMessage(
							{ token: "${token}" },
							${envConfig.frontendUrl}
						);
						window.close();
					</script>
				</body>
			</html>
		`);
	}
);

export default router;
