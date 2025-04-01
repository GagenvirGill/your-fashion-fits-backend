// src/contollers/itemController.js
import Item from "../models/item.js";
import Category from "../models/category.js";
import { Op } from "sequelize";

export const getAllItems = async (req, res) => {
	try {
		const { categories } = req.query;

		if (!categories || categories.length === 0) {
			const items = await Item.findAll();
			console.log(`Retrieved ${items.length} Items`);

			res.status(200).json({
				success: true,
				message: `Retrieved ${items.length} Items`,
				data: items,
			});
		} else {
			const items = await Item.findAll({
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
	let imgPath = null;
	if (req.file) {
		imgPath = `/uploads/${req.file.filename}`;
	}

	try {
		const item = await Item.create({
			imagePath: imgPath,
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

	try {
		const numAffectedRows = await Item.destroy({
			where: {
				itemId: {
					[Op.eq]: itemId,
				},
			},
		});
		console.log(`Item successfully deleted`);

		if (numAffectedRows > 0) {
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

	try {
		const item = await Item.findOne({
			where: {
				itemId: itemId,
			},
			include: {
				model: Category,
				as: "Categories",
			},
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

	try {
		const item = await Item.findByPk(itemId);
		if (!item) {
			return res.status(404).json({
				success: false,
				message: `Item not found`,
			});
		}

		const foundCategories = await Category.findAll({
			where: {
				categoryId: {
					[Op.in]: categories,
				},
			},
		});

		if (foundCategories.length < 1) {
			return res.status(404).json({
				success: false,
				message: `Categories not found`,
			});
		}

		await Promise.all(
			foundCategories.map((category) => item.addCategory(category))
		);

		console.log(
			`Item successfully added to ${foundCategories.length} Categories`
		);
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

	try {
		const item = await Item.findByPk(itemId);
		if (!item) {
			return res.status(404).json({
				success: false,
				message: `Item not found`,
			});
		}

		const foundCategories = await Category.findAll({
			where: {
				categoryId: {
					[Op.in]: categories,
				},
			},
		});

		if (foundCategories.length < 1) {
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
		console.log(
			`Item successfully deleted from ${foundCategories.length} Categories`
		);
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
