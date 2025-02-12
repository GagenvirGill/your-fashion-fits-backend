// models/outfit.js
const { DataTypes } = require('sequelize');

module.exports = (sequelizeInst) => {
    return sequelizeInst.define('Outfit', {
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
};
