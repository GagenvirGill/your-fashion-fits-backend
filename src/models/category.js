// src/models/category.js
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Category = sequelize.define("Category", {
	categoryId: {
		type: DataTypes.UUID,
		defaultValue: DataTypes.UUIDV4,
		primaryKey: true,
	},
	name: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true,
	},
	favoriteItem: {
		type: DataTypes.UUID,
		allowNull: true,
		references: {
			model: "Items",
			key: "itemId",
		},
		onUpdate: "CASCADE",
		onDelete: "SET NULL",
	},
});

export default Category;
