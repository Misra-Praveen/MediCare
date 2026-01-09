import { Router } from "express";
import { createCategory, createSubCategory } from "../controllers/CategoryController";
import protect from "../middleware/authMiddleware";
import checkRole from "../middleware/checkRoleMiddleware";

const categoryRouter = Router();

categoryRouter.post("/category", protect, checkRole("ADMIN"), createCategory)
categoryRouter.post("/subCategory", protect, checkRole("ADMIN"), createSubCategory)

export default categoryRouter