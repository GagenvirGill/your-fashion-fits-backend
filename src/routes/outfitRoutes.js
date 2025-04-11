// src/routes/outfitRoutes.js
import { Router } from "express";
import {
	getAllOutfits,
	createOutfit,
	deleteOutfit,
	addItemsToOutfit,
	removeItemsFromOutfit,
} from "../controllers/outfitController.js";
import upload from "../middleware/multerFileUpload.js";

const router = Router();

router.get("/", getAllOutfits);
router.post("/", upload.single("image"), createOutfit);
router.delete("/:outfitId", deleteOutfit);

router.post("/:outfitId/items", addItemsToOutfit);
router.delete("/:outfitId/items", removeItemsFromOutfit);

export default router;
