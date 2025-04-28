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
		failureRedirect: "http://localhost:5173/",
		session: false,
	}),
	(req, res) => {
		const { token } = req.user;
		res.redirect(`http://localhost:5173/home?token=${token}`);
	}
);

export default router;
