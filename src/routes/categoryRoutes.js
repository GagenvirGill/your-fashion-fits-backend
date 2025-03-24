// src/routes/categoryRoutes.js
import { Router } from "express";
import {
	getAllCategories,
	createCategory,
	deleteCategory,
	addCategoryToItems,
	removeCategoryFromItems,
} from "../controllers/categoryController.js";

const router = Router();

router.get("/", getAllCategories);
router.post("/", createCategory);
router.delete("/:categoryId", deleteCategory);

router.post("/:categoryId/items", addCategoryToItems);
router.delete("/:categoryId/items", removeCategoryFromItems);

export default router;
