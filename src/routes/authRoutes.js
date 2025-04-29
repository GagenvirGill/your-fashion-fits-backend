// src/routes/authRoutes.js
import { Router } from "express";
import passport from "passport";

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
		failureRedirect: "https://your-fashion-fits-frontend.vercel.app",
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
							"https://your-fashion-fits-frontend.vercel.app"
						);
						window.close();
					</script>
				</body>
			</html>
		`);
	}
);

export default router;
