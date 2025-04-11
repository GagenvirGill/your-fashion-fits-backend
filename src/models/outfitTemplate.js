// src/models/outfitTemplate.js
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const OutfitTemplate = sequelize.define("OutfitTemplate", {
	outfitTemplateId: {
		type: DataTypes.UUID,
		defaultValue: DataTypes.UUIDV4,
		primaryKey: true,
	},
});

export default OutfitTemplate;
