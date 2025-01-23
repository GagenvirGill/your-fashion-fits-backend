// models/item.js
const { sequelize } = require('../config/db');
const { DataTypes } = require('sequelize');

const Item = sequelize.define('Item', {
    itemId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    image: {
        type: DataTypes.BLOB,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
});

module.exports = Item;
