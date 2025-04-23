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
		session: true,
	}),
	(req, res) => {
		res.redirect("http://localhost:5173/home");
	}
);

router.get("/logout", (req, res) => {
	req.logout(() => {
		res.redirect("http://localhost:5173/");
	});
});

router.get("/check", (req, res) => {
	if (req.isAuthenticated()) {
		res.json({ loggedIn: true });
	} else {
		res.json({ loggedIn: false });
	}
});

export default router;
