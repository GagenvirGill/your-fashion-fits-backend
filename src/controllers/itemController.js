// src/contollers/itemController.js
import Item from "../models/item.js";
import Category from "../models/category.js";
import { Op } from "sequelize";
import { r2Upload, r2Delete } from "../config/r2Util.js";
import envConfig from "../config/envConfig.js";

export const getAllItems = async (req, res) => {
	try {
		const { categories } = req.query;
		const userId = req.user.userId;

		if (!userId) {
			return res.status(400).json({
				success: false,
				message: "User ID is required",
			});
		}

		if (!categories || categories.length === 0) {
			const items = await Item.findAll({
				where: {
					userId: userId,
				},
				attributes: [
					"itemId",
					"imagePath",
					"imageWidth",
					"imageHeight",
				],
			});
			console.log(`Retrieved ${items.length} Items`);

			res.status(200).json({
				success: true,
				message: `Retrieved ${items.length} Items`,
				data: items,
			});
		} else {
			const items = await Item.findAll({
				where: {
					userId: userId,
				},
				include: {
					model: Category,
					where: {
						categoryId: {
							[Op.in]: categories,
						},
					},
					through: {
						attributes: [],
					},
				},
				attributes: [
					"itemId",
					"imagePath",
					"imageWidth",
					"imageHeight",
				],
			});
			console.log(`Retrieved ${items.length} Filtered Items`);

			res.status(200).json({
				success: true,
				message: `Retrieved ${items.length} Filtered Items`,
				data: items,
			});
		}
	} catch (error) {
		console.error(error.message);
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

export const createItem = async (req, res) => {
	let imgPath;
	if (req.file) {
		try {
			imgPath = await r2Upload(req.file);
		} catch (err) {
			console.error("Upload to R2 failed", err);
			return res
				.status(500)
				.json({ success: false, message: "Upload to R2 failed" });
		}
	} else {
		console.log("Image is required");
		return res.status(400).json({
			success: false,
			message: "Image is required",
		});
	}

	let imgWidth;
	let imgHeight;
	if (req.imageDimensions) {
		imgWidth = req.imageDimensions.width;
		imgHeight = req.imageDimensions.height;
	} else {
		console.log("Image Dimensions are required");
		return res.status(400).json({
			success: false,
			message: "Image Dimensions are required",
		});
	}

	const userId = req.user.userId;
	if (!userId) {
		console.log("User ID is required");
		return res.status(400).json({
			success: false,
			message: "User ID is required",
		});
	}

	try {
		const item = await Item.create({
			userId: userId,
			imagePath: imgPath,
			imageWidth: imgWidth,
			imageHeight: imgHeight,
		});
		console.log(`Item successfully created`);
		res.status(201).json({
			success: true,
			message: `Item successfully created`,
			data: item,
		});
	} catch (error) {
		console.error(error.message);
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

export const deleteItem = async (req, res) => {
	const { itemId } = req.params;
	const userId = req.user.userId;

	if (!itemId) {
		return res.status(400).json({
			success: false,
			message: "Item ID is required",
		});
	}

	if (!userId) {
		return res.status(400).json({
			success: false,
			message: "User ID is required",
		});
	}

	try {
		const item = await Item.findOne({
			where: {
				userId: userId,
				itemId: {
					[Op.eq]: itemId,
				},
			},
		});

		if (!item) {
			return res.status(404).json({
				success: false,
				message: `Item not found`,
			});
		}

		const numAffectedRows = await Item.destroy({
			where: {
				userId: userId,
				itemId: {
					[Op.eq]: itemId,
				},
			},
		});

		if (numAffectedRows > 0) {
			console.log(`Item successfully deleted`);

			if (item.imagePath) {
				const key = item.imagePath.replace(`${envConfig.r2URL}/`, "");
				await r2Delete(key);
				console.log(`File successfully deleted from R2: ${key}`);
			}

			res.status(200).json({
				success: true,
				message: `Item successfully deleted`,
			});
		} else {
			res.status(404).json({
				success: false,
				message: `Item not found`,
			});
		}
	} catch (error) {
		console.error(error.message);
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

export const getItemsCategories = async (req, res) => {
	const { itemId } = req.params;
	const userId = req.user.userId;

	if (!itemId) {
		return res.status(400).json({
			success: false,
			message: "Item ID is required",
		});
	}

	if (!userId) {
		return res.status(400).json({
			success: false,
			message: "User ID is required",
		});
	}

	try {
		const item = await Item.findOne({
			where: {
				userId: userId,
				itemId: itemId,
			},
			include: {
				model: Category,
				as: "Categories",
				attributes: ["categoryId", "name", "favoriteItem"],
				order: [["createdAt", "ASC"]],
			},
			attributes: ["itemId", "imagePath"],
		});

		if (item && item.Categories) {
			console.log(`Items Categories retrieved successfully`);

			res.status(200).json({
				success: true,
				message: `Retrieved ${item.Categories.length} Categories for Item`,
				data: item.Categories,
			});
		} else {
			console.log(`No Categories Exist for that Item`);

			res.status(404).json({
				success: false,
				message: `No Categories Exist for that Item`,
			});
		}
	} catch (error) {
		console.error(error.message);
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

export const addItemToCategories = async (req, res) => {
	const { itemId } = req.params;
	const { categories } = req.body;
	const userId = req.user.userId;

	if (!itemId) {
		return res.status(400).json({
			success: false,
			message: "Item ID is required",
		});
	}

	if (!categories || !Array.isArray(categories) || categories.length === 0) {
		return res.status(400).json({
			success: false,
			message: "Categories are required",
		});
	}

	if (!userId) {
		return res.status(400).json({
			success: false,
			message: "User ID is required",
		});
	}

	console.log(categories);

	try {
		const item = await Item.findOne({
			where: {
				userId: userId,
				itemId: itemId,
			},
		});
		if (!item) {
			console.log(`Item not found`);
			return res.status(404).json({
				success: false,
				message: `Item not found`,
			});
		}

		const foundCategories = await Category.findAll({
			where: {
				userId: userId,
				categoryId: {
					[Op.in]: categories,
				},
			},
		});

		if (foundCategories.length < 1) {
			console.log(`Categories not found`);
			return res.status(404).json({
				success: false,
				message: `Categories not found`,
			});
		}

		await Promise.all(
			foundCategories.map((category) => item.addCategory(category))
		);

		console.log(`Item added to ${foundCategories.length} Categories`);
		res.status(200).json({
			success: true,
			message: `Item successfully added to ${foundCategories.length} Categories`,
		});
	} catch (error) {
		console.error(error.message);
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

export const removeItemFromCategories = async (req, res) => {
	const { itemId } = req.params;
	const { categories } = req.body;
	const userId = req.user.userId;

	if (!itemId) {
		return res.status(400).json({
			success: false,
			message: "Item ID is required",
		});
	}

	if (!categories || !Array.isArray(categories) || categories.length === 0) {
		return res.status(400).json({
			success: false,
			message: "Categories are required",
		});
	}

	if (!userId) {
		return res.status(400).json({
			success: false,
			message: "User ID is required",
		});
	}

	try {
		const item = await Item.findOne({
			where: {
				userId: userId,
				itemId: itemId,
			},
		});
		if (!item) {
			console.log(`Item not found`);
			return res.status(404).json({
				success: false,
				message: `Item not found`,
			});
		}

		const foundCategories = await Category.findAll({
			where: {
				userId: userId,
				categoryId: {
					[Op.in]: categories,
				},
			},
		});

		if (foundCategories.length < 1) {
			console.log(`Categories not found`);
			return res.status(404).json({
				success: false,
				message: `Categories not found`,
			});
		}

		await Promise.all(
			foundCategories.map((category) => item.removeCategory(category))
		);

		for (const category of foundCategories) {
			await item.removeCategory(category);
		}
		console.log(`Item deleted from ${foundCategories.length} Categories`);
		res.status(200).json({
			success: true,
			message: `Item successfully deleted from ${foundCategories.length} Categories`,
		});
	} catch (error) {
		console.error(error.message);
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

export const getRandomItemFromCategories = async (req, res) => {
	try {
		const { categories } = req.query;
		const userId = req.user.userId;

		if (!userId) {
			return res.status(400).json({
				success: false,
				message: "User ID is required",
			});
		}

		let items;

		if (
			!categories ||
			!Array.isArray(categories) ||
			categories.length === 0
		) {
			items = await Item.findAll({
				where: {
					userId: userId,
				},
				attributes: [
					"itemId",
					"imagePath",
					"imageWidth",
					"imageHeight",
				],
			});
		} else {
			items = await Item.findAll({
				where: {
					userId: userId,
				},
				include: {
					model: Category,
					where: {
						categoryId: {
							[Op.in]: categories,
						},
					},
					attributes: [],
				},
				attributes: [
					"itemId",
					"imagePath",
					"imageWidth",
					"imageHeight",
				],
			});
		}

		if (items.length === 0) {
			console.log("No items found for the given categories");
			return res.status(404).json({
				success: false,
				message: "No items found for the given categories",
			});
		}

		const randomIndex = Math.floor(Math.random() * items.length);
		const randomItem = items[randomIndex];

		console.log(`Random item selected: ${randomItem.itemId}`);
		res.status(200).json({
			success: true,
			message: "Random item retrieved successfully",
			data: randomItem,
		});
	} catch (error) {
		console.error(error.message);
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};
