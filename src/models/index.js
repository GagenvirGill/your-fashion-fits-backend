// src/models/index.js
import Category from "./category.js";
import Item from "./item.js";
import Outfit from "./outfit.js";

Item.belongsToMany(Category, {
	through: "ItemHasCategory",
});

Item.belongsToMany(Outfit, {
	through: "OutfitHasItem",
});

Category.belongsToMany(Item, {
	through: "ItemHasCategory",
});

Category.belongsToMany(Outfit, {
	through: "OutfitHasCategory",
});

Outfit.belongsToMany(Item, {
	through: "OutfitHasItem",
});

Outfit.belongsToMany(Category, {
	through: "OutfitHasCategory",
});

export default { Category, Item, Outfit };
