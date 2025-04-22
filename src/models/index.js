// src/models/index.js
import Item from "./item.js";
import Category from "./category.js";
import Outfit from "./outfit.js";

import OutfitTemplate from "./outfitTemplate.js";
import TemplateRow from "./templateRow.js";
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

OutfitTemplate.hasMany(TemplateRow, {
	foreignKey: "outfitTemplateId",
	onUpdate: "CASCADE",
	onDelete: "CASCADE",
});

TemplateRow.belongsTo(OutfitTemplate, {
	foreignKey: "outfitTemplateId",
	onUpdate: "CASCADE",
	onDelete: "CASCADE",
});

TemplateRow.hasMany(TemplateItem, {
	foreignKey: "templateRowId",
	onUpdate: "CASCADE",
	onDelete: "CASCADE",
});

TemplateItem.belongsTo(TemplateRow, {
	foreignKey: "templateRowId",
	onUpdate: "CASCADE",
	onDelete: "CASCADE",
});

Item.hasMany(TemplateItem, {
	foreignKey: "itemId",
	onUpdate: "CASCADE",
	onDelete: "CASCADE",
});

TemplateItem.belongsTo(Item, {
	foreignKey: "itemId",
	onUpdate: "CASCADE",
	onDelete: "CASCADE",
});

Outfit.hasOne(OutfitTemplate, {
	foreignKey: "outfitId",
	onUpdate: "CASCADE",
	onDelete: "CASCADE",
});

OutfitTemplate.belongsTo(Outfit, {
	foreignKey: "outfitId",
	onUpdate: "CASCADE",
	onDelete: "CASCADE",
});

export default {
	Category,
	Item,
	Outfit,
	OutfitTemplate,
	TemplateRow,
	TemplateItem,
};
