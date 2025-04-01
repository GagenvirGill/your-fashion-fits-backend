// src/models/index.js
import Item from "./item.js";
import Category from "./category.js";
import Outfit from "./outfit.js";

Item.belongsToMany(Category, {
	through: "ItemHasCategory",
	onUpdate: "CASCADE",
	onDelete: "CASCADE",
});

Item.belongsToMany(Outfit, {
	through: "OutfitHasItem",
	onUpdate: "CASCADE",
	onDelete: "CASCADE",
});

Category.belongsToMany(Item, {
	through: "ItemHasCategory",
	onUpdate: "CASCADE",
	onDelete: "CASCADE",
});

Outfit.belongsToMany(Item, {
	through: "OutfitHasItem",
	onUpdate: "CASCADE",
	onDelete: "CASCADE",
});

export default { Category, Item, Outfit };
