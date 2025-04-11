// src/models/templateItem.js
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const TemplateItem = sequelize.define("TemplateItem", {
	templateItemId: {
		type: DataTypes.UUID,
		defaultValue: DataTypes.UUIDV4,
		primaryKey: true,
	},
	orderNum: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
});

export default TemplateItem;
