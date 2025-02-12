// models/index.js
const itemModel = require('./item.js');
const categoryModel = require('./category.js');
const outfitModel = require('./outfit.js');

module.exports = (sequelizeInst) => {
    const Item = itemModel(sequelizeInst);
    const Category = categoryModel(sequelizeInst);
    const Outfit = outfitModel(sequelizeInst);

    Item.belongsToMany(Category, {
        through: 'ItemHasCategory',
    });

    Item.belongsToMany(Outfit, {
        through: 'OutfitHasItem',
    });

    Category.belongsToMany(Item, {
        through: 'ItemHasCategory',
    });

    Category.belongsToMany(Outfit, {
        through: 'OutfitHasCategory',
    });

    Outfit.belongsToMany(Item, {
        through: 'OutfitHasItem',
    });

    Outfit.belongsToMany(Category, {
        through: 'OutfitHasCategory',
    });
};
