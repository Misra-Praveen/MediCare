import { Router } from "express";
import protect from "../middleware/authMiddleware";
import checkRole from "../middleware/checkRoleMiddleware";
import { getDashboardSummary, getSalesReport, getTopSellingMedicines, getLowStockReport, getExpiryReport, getRecentBills } from "../controllers/ReportController";

const reportRouter = Router();

reportRouter.get("/dashboard/summary", protect, checkRole("ADMIN"), getDashboardSummary);
reportRouter.get("/sales", protect, checkRole("ADMIN"), getSalesReport);
reportRouter.get("/top-medicines", protect, checkRole("ADMIN"), getTopSellingMedicines);
reportRouter.get("/low-stock", protect, checkRole("ADMIN", "STAFF"), getLowStockReport);
reportRouter.get("/expiry", protect, checkRole("ADMIN", "STAFF"), getExpiryReport);
reportRouter.get("/dashboard/recent-bills", protect, checkRole("ADMIN", "STAFF"), getRecentBills)

export default reportRouter;