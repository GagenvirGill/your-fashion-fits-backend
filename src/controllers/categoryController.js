// src/contollers/categoryController.js
import Category from "../models/category.js";
import Item from "../models/item.js";
import { Op } from "sequelize";

export const getAllCategories = async (req, res) => {
	try {
		const categories = await Category.findAll();
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
	const { name, description } = req.body;

	try {
		const category = await Category.create({
			name: name,
			description: description,
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

	try {
		const numAffectedRows = await Category.destroy({
			where: {
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

	try {
		const category = await Category.findByPk(categoryId);
		if (!category) {
			return res.status(404).json({
				success: false,
				message: `Category not found`,
			});
		}

		const foundItems = await Item.findAll({
			where: {
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

		for (const item of foundItems) {
			await category.addItem(item);
		}
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

	try {
		const category = await Category.findByPk(categoryId);
		if (!category) {
			return res.status(404).json({
				success: false,
				message: `Category not found`,
			});
		}

		const filtItems = await Item.findAll({
			where: {
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

		for (const item of filtItems) {
			await category.removeItem(item);
		}
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
	const { categoryI, itemId } = req.params;

	try {
		const category = await Category.findByPk(categoryId);
		if (!category) {
			return res.status(404).json({
				success: false,
				message: `Category not found`,
			});
		}

		const item = await Item.findByPk(itemId);
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

// the cascade stuff for the many to many, both on update and on delete
