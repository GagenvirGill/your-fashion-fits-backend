// src/contollers/outfitController.js
import Outfit from "../models/outfit.js";
import Item from "../models/item.js";
import { Op } from "sequelize";

export const getAllOutfits = async (req, res) => {
	try {
		const outfits = await Outfit.findAll();
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

export const getItemsForAnOutfit = async (req, res) => {
	try {
		const { outfitId } = req.params;

		const outfit = await Outfit.findByPk(outfitId, {
			include: [{ model: Item, through: { attributes: [] } }],
		});

		if (!outfit) {
			return res.status(404).json({
				success: false,
				message: `Outfit not found`,
			});
		}

		console.log(`Retrieved items for outfit worn on ${outfit.dateWorn}`);
		res.status(200).json({
			success: true,
			message: `Retrieved items for outfit worn on ${outfit.dateWorn}`,
			data: outfit.Items,
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

		let message = `Successfully Created Outfit worn on ${dateWorn}`;

		if (items && items.length > 0) {
			const itemInstances = await Item.findAll({
				where: { id: { [Op.in]: items } },
			});
			await newOutfit.addItems(itemInstances);
			message + ` and added ${itemInstances.length} items to it`;
		}

		res.status(201).json({
			success: true,
			message: message,
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
