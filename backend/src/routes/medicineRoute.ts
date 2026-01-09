import { Router } from "express";
import protect from "../middleware/authMiddleware";
import checkRole from "../middleware/checkRoleMiddleware";
import { createMedicine, getMedicineAll, updateMedicine } from "../controllers/MedicineController";

const medicineRouter = Router();
medicineRouter.post("/medicines", protect, checkRole("ADMIN"), createMedicine)
medicineRouter.put("/medicines/:id", protect, checkRole("ADMIN"), updateMedicine)
medicineRouter.get("/medicines", getMedicineAll)

export default medicineRouter;