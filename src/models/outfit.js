// src/models/outfit.js
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Outfit = sequelize.define("Outfit", {
	outfitId: {
		type: DataTypes.UUID,
		defaultValue: DataTypes.UUIDV4,
		primaryKey: true,
	},
	dateWorn: {
		type: DataTypes.DATEONLY,
		allowNull: false,
	},
	image: {
		type: DataTypes.BLOB,
		allowNull: true,
	},
	description: {
		type: DataTypes.TEXT,
		allowNull: true,
	},
});

export default Outfit;
