// src/routes/outfitRoutes.js
import { Router } from "express";
import {
	getAllOutfits,
	getItemsForAnOutfit,
	createOutfit,
	deleteOutfit,
	addItemsToOutfit,
	removeItemsFromOutfit,
} from "../controllers/outfitController.js";

const router = Router();

router.get("/", getAllOutfits);
router.post("/", createOutfit);
router.delete("/:outfitId", deleteOutfit);

router.get("/:outfitId/items", getItemsForAnOutfit);
router.post("/:outfitId/items", addItemsToOutfit);
router.delete("/:outfitId/items", removeItemsFromOutfit);

export default router;
