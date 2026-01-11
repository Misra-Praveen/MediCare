import { Router } from "express";
import protect from "../middleware/authMiddleware";
import { createBill } from "../controllers/BillController";
import checkRole from "../middleware/checkRoleMiddleware";

const billRouter = Router();

billRouter.post("/billing", protect,checkRole("ADMIN", "STAFF"), createBill);

export default billRouter;