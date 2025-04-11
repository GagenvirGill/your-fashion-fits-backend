// src/contollers/outfitController.js
import Outfit from "../models/outfit.js";
import Item from "../models/item.js";
import OutfitTemplate from "../models/outfitTemplate.js";
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
					attributes: ["outfitTemplateId"],
					include: [
						{
							model: TemplateItem,
							attributes: ["templateItemId", "orderNum"],
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

		const outfitTemplate = await OutfitTemplate.create({
			outfitId: newOutfit.outfitId,
		});

		await Promise.all(
			Object.entries(items).map(([key, value]) =>
				TemplateItem.create({
					outfitTemplateId: outfitTemplate.outfitTemplateId,
					itemId: value,
					orderNum: Number(key),
				})
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

export const addItemsToOutfit = async (req, res) => {
	try {
		const { outfitId } = req.params;
		const { items } = req.body;

		const outfit = await Outfit.findByPk(outfitId);
		if (!outfit) {
			return res.status(404).json({
				success: false,
				message: `Outfit not found`,
			});
		}

		const foundItems = await Item.findAll({
			where: {
				itemId: {
					[Op.in]: items,
				},
			},
		});

		if (foundItems.length < 1) {
			return res.status(404).json({
				success: false,
				message: `Items not found`,
			});
		}

		await Promise.all(foundItems.map((item) => outfit.addItem(item)));

		console.log(`${foundItems.length} Items successfully added to Outfit`);
		res.status(200).json({
			success: true,
			message: `${foundItems.length} Items successfully added to Outfit`,
		});
	} catch (err) {
		console.error(err.message);
		res.status(500).json({
			success: false,
			message: err.message,
		});
	}
};

export const removeItemsFromOutfit = async (req, res) => {
	try {
		const { outfitId } = req.params;
		const { items } = req.body;

		const outfit = await Outfit.findByPk(outfitId);
		if (!outfit) {
			return res.status(404).json({
				success: false,
				message: `Outfit not found`,
			});
		}

		const filtItems = await Item.findAll({
			where: {
				itemId: {
					[Op.in]: items,
				},
			},
		});
		if (filtItems.length < 1) {
			return res.status(404).json({
				success: false,
				message: `Items not found`,
			});
		}

		await Promise.all(filtItems.map((item) => outfit.removeItem(item)));

		console.log(
			`${filtItems.length} Items successfully removed from Outfit`
		);
		res.status(200).json({
			success: true,
			message: `${filtItems.length} Items successfully removed from Outfit`,
		});
	} catch (err) {
		console.error(err.message);
		res.status(500).json({
			success: false,
			message: err.message,
		});
	}
};
