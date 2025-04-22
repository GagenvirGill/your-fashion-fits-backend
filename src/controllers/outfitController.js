// src/contollers/outfitController.js
import Outfit from "../models/outfit.js";
import Item from "../models/item.js";
import OutfitTemplate from "../models/outfitTemplate.js";
import TemplateRow from "../models/templateRow.js";
import TemplateItem from "../models/templateItem.js";
import { Op } from "sequelize";

export const getAllOutfits = async (req, res) => {
	try {
		const outfits = await Outfit.findAll({
			order: [["dateWorn", "DESC"]],
			attributes: ["outfitId", "dateWorn", "description"],
			include: [
				{
					model: OutfitTemplate,
					attributes: ["outfitTemplateId", "totalWeight"],
					include: [
						{
							model: TemplateItem,
							attributes: [
								"templateItemId",
								"orderNum",
								"itemWeight",
							],
							include: [
								{
									model: Item,
									attributes: ["itemId", "imagePath"],
								},
							],
						},
					],
				},
			],
		});
		console.log(`Retrieved ${outfits.length} Outfits`);
		res.status(200).json({
			success: true,
			message: `Retrieved ${outfits.length} Outfits`,
			data: outfits,
		});
	} catch (err) {
		console.error(err.message);
		res.status(500).json({
			success: false,
			message: err.message,
		});
	}
};

export const createOutfit = async (req, res) => {
	try {
		const { dateWorn, description, items } = req.body;
		console.log(items);

		if (!dateWorn) {
			return res.status(400).json({
				success: false,
				message: "Date worn for the outfit is required",
			});
		}

		const newOutfit = await Outfit.create({
			dateWorn,
			description: description || null,
		});

		let totalWeight = 0;
		items.forEach((itemsRow) => {
			itemsRow.forEach((item) => {
				totalWeight += item.itemWeight;
			});
		});

		const outfitTemplate = await OutfitTemplate.create({
			outfitId: newOutfit.outfitId,
			totalWeight: totalWeight,
		});

		const templateRows = await Promise.all(
			items.map((_, index) =>
				TemplateRow.create({
					outfitTemplateId: outfitTemplate.outfitTemplateId,
					orderNum: index,
				})
			)
		);

		await Promise.all(
			templateRows.map((row, rowIdx) =>
				items[rowIdx].map((currItem, itemIdx) =>
					TemplateItem.create({
						templateRowId: row.templateRowId,
						itemId: currItem.itemId,
						orderNum: itemIdx,
						itemWeight: currItem.itemWeight,
					})
				)
			)
		);

		res.status(201).json({
			success: true,
			message: `Successfully Created Outfit worn on ${dateWorn}`,
			data: newOutfit,
		});
	} catch (err) {
		console.error(err.message);
		res.status(500).json({
			success: false,
			message: err.message,
		});
	}
};

export const deleteOutfit = async (req, res) => {
	try {
		const { outfitId } = req.params;

		const numAffectedRows = await Outfit.destroy({
			where: {
				outfitId: outfitId,
			},
		});
		console.log(`Outfit successfully deleted`);

		if (numAffectedRows > 0) {
			res.status(200).json({
				success: true,
				message: `Outfit successfully deleted`,
			});
		} else {
			res.status(404).json({
				success: false,
				message: `Outfit not found`,
			});
		}
	} catch (err) {
		console.error(err.message);
		res.status(500).json({
			success: false,
			message: err.message,
		});
	}
};
