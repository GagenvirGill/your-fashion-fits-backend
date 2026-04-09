import { Router } from "express";
import { syncUser } from "../controllers/userController.js";

const router = Router();

router.post("/sync", syncUser);

export default router;
