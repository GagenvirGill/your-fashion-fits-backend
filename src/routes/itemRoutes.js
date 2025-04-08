// src/routes/itemRoutes.js
import { Router } from "express";
import {
	getAllItems,
	createItem,
	deleteItem,
	getItemsCategories,
	addItemToCategories,
	removeItemFromCategories,
	getRandomItemFromCategories,
} from "../controllers/itemController.js";
import upload from "../middleware/multerFileUpload.js";

const router = Router();

router.get("/", getAllItems);
router.post("/", upload.single("image"), createItem);
router.delete("/:itemId", deleteItem);

router.get("/:itemId/categories", getItemsCategories);
router.post("/:itemId/categories", addItemToCategories);
router.delete("/:itemId/categories", removeItemFromCategories);

router.get("/random", getRandomItemFromCategories);

export default router;
