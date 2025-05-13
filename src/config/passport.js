import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import envConfig from "./envConfig.js";

passport.use(
	new GoogleStrategy(
		{
			clientID: envConfig.googleClientId,
			clientSecret: envConfig.googleClientSecret,
			callbackURL: `${envConfig.backendUrl}/auth/google/callback`,
		},
		async (accessToken, refreshToken, profile, done) => {
			try {
				const [user, created] = await User.findOrCreate({
					where: { providerId: profile.id },
					defaults: {
						provider: "google",
						email: profile.emails?.[0]?.value,
					},
				});

				const token = jwt.sign(
					{ userId: user.userId, email: user.email },
					envConfig.jwtSecret,
					{ expiresIn: "3h" }
				);

				return done(null, { user, token });
			} catch (err) {
				return done(err);
			}
		}
	)
);
