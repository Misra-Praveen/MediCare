import { Router } from "express";
import protect from "../middleware/authMiddleware";
import { createBill, getAllBills, getBillByBillNumber, getBillsByDateRange, getDailySalesReport } from "../controllers/BillController";
import checkRole from "../middleware/checkRoleMiddleware";

const billRouter = Router();

billRouter.post("/billing", protect,checkRole("ADMIN", "STAFF"), createBill);
billRouter.get("/bills", protect,checkRole("ADMIN"), getAllBills);
billRouter.get("/bills/date-range", protect,checkRole("ADMIN"), getBillsByDateRange);
billRouter.get("/bills/daily-report", protect,checkRole("ADMIN", "STAFF"), getDailySalesReport);
billRouter.get("/bills/:billNumber", protect,checkRole("ADMIN", "STAFF"), getBillByBillNumber);


export default billRouter;