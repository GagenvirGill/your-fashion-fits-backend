// contollers/itemController.js
const { Item } = require('../models/index.js');

exports.getAllItems = async (req, res) => {
    try {
        const items = await Item.findAll();
        console.log(`Retrieved ${items.length} Items`);
        res.status(200).json({
            success: true,
            message: `Retrieved ${items.length} Items`,
            data: items
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.createItem = async (req, res) => {
    const { image, description } = req.body;

    try {
        const item = await Item.create({ 
            image: image, 
            description: description,
        });
        console.log(`Item successfully created`);
        res.status(201).json({
            success: true,
            message: `Item successfully created`,
            data: item,
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// bulk create

exports.deleteItem = async (req, res) => {
    const { itemId } = req.params;

    try {
        const numAffectedRows = await Item.destroy({ 
            where: { 
                itemId: itemId 
            }
        });
        console.log(`Item successfully deleted`);

        if (numAffectedRows > 0) {
            res.status(200).json({
                success: true,
                message: `Item successfully deleted`,
            });
        } else {
            res.status(404).json({
                success: false,
                message: `Item not found`,
            });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

// update
