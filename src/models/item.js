// models/item.js
const { DataTypes } = require('sequelize');

module.exports = (sequelizeInst) => {
    return sequelizeInst.define('Item', {
        itemId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        imagePath: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    });
};
