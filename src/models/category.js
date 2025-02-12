// models/category.js
const { DataTypes } = require('sequelize');

module.exports = (sequelizeInst) => {
    return sequelizeInst.define('Category', {
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
}; 
