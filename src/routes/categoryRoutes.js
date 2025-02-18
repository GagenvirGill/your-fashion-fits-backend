// src/routes/categoryRoutes.js
import { Router } from "express";
import {
	getAllCategories,
	createCategory,
	deleteCategory,
} from "../controllers/categoryController.js";

const router = Router();

router.get("/", getAllCategories);
router.post("/", createCategory);
router.delete("/:categoryId", deleteCategory);

export default router;
