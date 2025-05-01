import sizeOf from "image-size";

const imageDimensions = (req, res, next) => {
	try {
		if (!req.file || !req.file.buffer) {
			return res.status(400).json({ error: "No image file uploaded" });
		}

		const dimensions = sizeOf(req.file.buffer);
		req.imageDimensions = dimensions;
		next();
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Failed to get image size" });
	}
};

export default imageDimensions;
