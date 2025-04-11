// src/routes/outfitRoutes.js
import { Router } from "express";
import {
	getAllOutfits,
	createOutfit,
	deleteOutfit,
} from "../controllers/outfitController.js";

const router = Router();

router.get("/", getAllOutfits);
router.post("/", createOutfit);
router.delete("/:outfitId", deleteOutfit);

export default router;
