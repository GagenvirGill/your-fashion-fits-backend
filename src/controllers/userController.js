import User from "../models/user.js";

export const syncUser = async (req, res) => {
	const { provider, providerId, email } = req.body;

	if (!provider || !providerId || !email) {
		return res.status(400).json({
			success: false,
			message: "provider, providerId, and email are required",
		});
	}

	try {
		const [user] = await User.findOrCreate({
			where: { providerId },
			defaults: { provider, providerId, email },
		});

		return res.status(200).json({
			success: true,
			userId: user.userId,
		});
	} catch (err) {
		console.error("Error syncing user:", err);
		return res.status(500).json({
			success: false,
			message: "Failed to sync user",
		});
	}
};
