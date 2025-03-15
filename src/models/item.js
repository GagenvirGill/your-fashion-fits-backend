// src/models/item.js
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Item = sequelize.define("Item", {
	itemId: {
		type: DataTypes.UUID,
		defaultValue: DataTypes.UUIDV4,
		primaryKey: true,
	},
	imagePath: {
		type: DataTypes.STRING,
		allowNull: false,
	},
});

export default Item;
