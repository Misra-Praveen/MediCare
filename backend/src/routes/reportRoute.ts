import { Router } from "express";
import protect from "../middleware/authMiddleware";
import checkRole from "../middleware/checkRoleMiddleware";
import { getDashboardSummary, getSalesReport, getTopSellingMedicines, getLowStockReport, getExpiryReport } from "../controllers/ReportController";

const reportRouter = Router();

reportRouter.get("/dashboard", protect, checkRole("ADMIN"), getDashboardSummary);
reportRouter.get("/sales", protect, checkRole("ADMIN"), getSalesReport);
reportRouter.get("/top-medicines", protect, checkRole("ADMIN"), getTopSellingMedicines);
reportRouter.get("/low-stock", protect, checkRole("ADMIN"), getLowStockReport);
reportRouter.get("/expiry", protect, checkRole("ADMIN"), getExpiryReport);

export default reportRouter;