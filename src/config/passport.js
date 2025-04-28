import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
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

				return done(null, user);
			} catch (err) {
				return done(err);
			}
		}
	)
);

passport.serializeUser((user, done) => {
	done(null, user.userId);
});

passport.deserializeUser(async (id, done) => {
	try {
		const user = await User.findByPk(id);
		done(null, user);
	} catch (err) {
		done(err);
	}
});
