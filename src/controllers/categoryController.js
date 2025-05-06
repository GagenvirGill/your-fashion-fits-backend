// src/contollers/categoryController.js
import Category from "../models/category.js";
import Item from "../models/item.js";
import { Op } from "sequelize";

export const getAllCategories = async (req, res) => {
	const userId = req.user.userId;
	if (!userId) {
		return res.status(400).json({
			success: false,
			message: "User ID is required",
		});
	}
	try {
		const categories = await Category.findAll({
			where: {
				userId: userId,
			},
			attributes: ["categoryId", "name", "favoriteItem"],
			order: [["createdAt", "ASC"]],
		});
		console.log(`Retrieved ${categories.length} Categories`);
		res.status(200).json({
			success: true,
			message: `Retrieved ${categories.length} Categories`,
			data: categories,
		});
	} catch (error) {
		console.error(error.message);
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

export const createCategory = async (req, res) => {
	const { name } = req.body;
	const userId = req.user.userId;

	if (!name) {
		return res.status(400).json({
			success: false,
			message: "Category name is required",
		});
	}
	if (!userId) {
		return res.status(400).json({
			success: false,
			message: "User ID is required",
		});
	}

	try {
		const category = await Category.create({
			userId: userId,
			name: name,
		});
		console.log(`Category with name: ${name} successfully created`);
		res.status(201).json({
			success: true,
			message: `Category with name: ${name} successfully created`,
			data: category,
		});
	} catch (error) {
		console.error(error.message);
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

export const deleteCategory = async (req, res) => {
	const { categoryId } = req.params;
	const userId = req.user.userId;

	if (!categoryId) {
		return res.status(400).json({
			success: false,
			message: "Category ID is required",
		});
	}
	if (!userId) {
		return res.status(400).json({
			success: false,
			message: "User ID is required",
		});
	}

	try {
		const numAffectedRows = await Category.destroy({
			where: {
				userId: userId,
				categoryId: categoryId,
			},
		});
		console.log(`Category successfully deleted`);

		if (numAffectedRows > 0) {
			res.status(200).json({
				success: true,
				message: `Category successfully deleted`,
			});
		} else {
			res.status(404).json({
				success: false,
				message: `Category not found`,
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

export const addCategoryToItems = async (req, res) => {
	const { categoryId } = req.params;
	const { items } = req.body;
	const userId = req.user.userId;

	if (!categoryId) {
		return res.status(400).json({
			success: false,
			message: "Category ID is required",
		});
	}
	if (!items || !Array.isArray(items) || items.length === 0) {
		return res.status(400).json({
			success: false,
			message: "Items array is required and cannot be empty",
		});
	}
	if (!userId) {
		return res.status(400).json({
			success: false,
			message: "User ID is required",
		});
	}

	try {
		const category = await Category.findOne({
			where: {
				categoryId: categoryId,
				userId: userId,
			},
		});
		if (!category) {
			return res.status(404).json({
				success: false,
				message: `Category not found`,
			});
		}

		const foundItems = await Item.findAll({
			where: {
				userId: userId,
				itemId: {
					[Op.in]: items,
				},
			},
		});

		if (foundItems.length < 1) {
			return res.status(404).json({
				success: false,
				message: `Items not found`,
			});
		}

		await Promise.all(foundItems.map((item) => category.addItem(item)));

		console.log(
			`Category successfully added to ${foundItems.length} Items`
		);
		res.status(200).json({
			success: true,
			message: `Category successfully added to ${foundItems.length} Items`,
		});
	} catch (error) {
		console.error(error.message);
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

export const removeCategoryFromItems = async (req, res) => {
	const { categoryId } = req.params;
	const { items } = req.body;
	const userId = req.user.userId;

	if (!categoryId) {
		return res.status(400).json({
			success: false,
			message: "Category ID is required",
		});
	}
	if (!items || !Array.isArray(items) || items.length === 0) {
		return res.status(400).json({
			success: false,
			message: "Items array is required and cannot be empty",
		});
	}
	if (!userId) {
		return res.status(400).json({
			success: false,
			message: "User ID is required",
		});
	}

	try {
		const category = await Category.findOne({
			where: {
				categoryId: categoryId,
				userId: userId,
			},
		});
		if (!category) {
			return res.status(404).json({
				success: false,
				message: `Category not found`,
			});
		}

		const filtItems = await Item.findAll({
			where: {
				userId: userId,
				itemId: {
					[Op.in]: items,
				},
			},
		});
		if (filtItems.length < 1) {
			return res.status(404).json({
				success: false,
				message: `Items not found`,
			});
		}

		await Promise.all(filtItems.map((item) => category.removeItem(item)));

		console.log(
			`Category successfully deleted from ${filtItems.length} Items`
		);
		res.status(200).json({
			success: true,
			message: `Category successfully deleted from ${filtItems.length} Items`,
		});
	} catch (error) {
		console.error(error.message);
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

export const setCategoriesFavItem = async (req, res) => {
	const { categoryId, itemId } = req.params;
	const userId = req.user.userId;

	if (!categoryId) {
		return res.status(400).json({
			success: false,
			message: "Category ID is required",
		});
	}
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
		const category = await Category.findOne({
			where: {
				userId: userId,
				categoryId: categoryId,
			},
		});
		if (!category) {
			return res.status(404).json({
				success: false,
				message: `Category not found`,
			});
		}

		const item = await Item.findOne({
			where: {
				userId: userId,
				itemId: itemId,
			},
		});
		if (!item) {
			return res.status(404).json({
				success: false,
				message: `Item not found`,
			});
		}

		category.favoriteItem = itemId;
		await category.save();

		console.log(`Selected favorite item for ${categoryId}`);
		res.status(200).json({
			success: true,
			message: `Selected favorite item for ${categoryId}`,
		});
	} catch (error) {
		console.error(error.message);
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};
