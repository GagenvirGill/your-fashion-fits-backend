// models/outfit.js
const { sequelize } = require('../config/db');
const { DataTypes } = require('sequelize');

const Outfit = sequelize.define('Outfit', {
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

module.exports = Outfit;
