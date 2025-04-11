// src/models/index.js
import Item from "./item.js";
import Category from "./category.js";
import Outfit from "./outfit.js";

import OutfitTemplate from "./outfitTemplate.js";
import TemplateItem from "./templateItem.js";

Item.belongsToMany(Category, {
	through: "ItemHasCategory",
	onUpdate: "CASCADE",
	onDelete: "CASCADE",
});

Category.belongsToMany(Item, {
	through: "ItemHasCategory",
	onUpdate: "CASCADE",
	onDelete: "CASCADE",
});

OutfitTemplate.hasMany(TemplateItem, {
	foreignKey: "outfitTemplateId",
	onUpdate: "CASCADE",
	onDelete: "CASCADE",
});

TemplateItem.belongsTo(OutfitTemplate, {
	foreignKey: "outfitTemplateId",
	onUpdate: "CASCADE",
	onDelete: "CASCADE",
});

Outfit.hasOne(OutfitTemplate, {
	foreignKey: "outfitTemplateId",
	onUpdate: "CASCADE",
	onDelete: "CASCADE",
});

OutfitTemplate.belongsTo(Outfit, {
	foreignKey: "outfitTemplateId",
	onUpdate: "CASCADE",
	onDelete: "CASCADE",
});

export default { Category, Item, Outfit, OutfitTemplate, TemplateItem };
