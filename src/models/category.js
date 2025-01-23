// models/category.js
const { sequelize } = require('../config/db');
const { DataTypes } = require('sequelize');

const Category = sequelize.define('Category', {
    categoryId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
});

module.exports = Category;
