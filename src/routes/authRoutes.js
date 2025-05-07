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
						if (window.opener) {
							window.opener.postMessage(
								{ token: "${token}" },
								"${envConfig.frontendUrl}"
							);

							setTimeout(() => {
                    			window.close(); // Close the pop-up window
                			}, 500);
						} else {
						 	console.error("No opener window found.");
						}
						window.close();
					</script>
				</body>
			</html>
		`);
	}
);

export default router;
