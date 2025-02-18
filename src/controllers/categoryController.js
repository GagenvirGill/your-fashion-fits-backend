// src/contollers/categoryController.js
import Category from "../models/category.js";

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

// bulk create

// update a category

// bulk add items to a category

// bulk remove items from a category

// the cascade stuff for the many to many, both on update and on delete
