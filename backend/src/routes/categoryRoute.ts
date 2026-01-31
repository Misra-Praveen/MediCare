import { Router } from "express";
import { createCategory, createSubCategory, getAllCategory, getAllSubCategory } from "../controllers/CategoryController";
import protect from "../middleware/authMiddleware";
import checkRole from "../middleware/checkRoleMiddleware";

const categoryRouter = Router();

categoryRouter.post("/category", protect, checkRole("ADMIN"), createCategory)
categoryRouter.post("/subCategory", protect, checkRole("ADMIN"), createSubCategory)
categoryRouter.get("/category", protect, checkRole("ADMIN"), getAllCategory)
categoryRouter.get("/subcategory", protect, checkRole("ADMIN"), getAllSubCategory)

export default categoryRouter