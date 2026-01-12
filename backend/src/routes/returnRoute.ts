import { Router } from "express";
import protect from "../middleware/authMiddleware";
import checkRole from "../middleware/checkRoleMiddleware";
import { returnMedicine } from "../controllers/ReturnController";


const returnRouter = Router();


returnRouter.post("/returns", protect, checkRole("ADMIN", "STAFF"), returnMedicine)

export default returnRouter;