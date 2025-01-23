// models/index.js
const Item = require('./item.js');
const Category = require('./category.js');
const Outfit = require('./outfit.js');

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

module.exports = { Item, Category, Outfit}
