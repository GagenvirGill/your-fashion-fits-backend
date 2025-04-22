// src/models/templateRow.js
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const TemplateRow = sequelize.define("TemplateRow", {
	templateRowId: {
		type: DataTypes.UUID,
		defaultValue: DataTypes.UUIDV4,
		primaryKey: true,
	},
	orderNum: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
});

export default TemplateRow;
