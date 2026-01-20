import { Request, Response } from "express";
import MedicineModel from "../models/MedicineModel";
import BillModule from "../models/BillModule";
import ReturnModel from "../models/ReturnModel";


export const getDashboardSummary = async (req: Request, res: Response)=>{
    try {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0)
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        const [totalMedicines, lowStockCount, todayBills, todayReturns,] = await Promise.all([
            MedicineModel.countDocuments({isActive : true}),
            MedicineModel.countDocuments({stock: {$lte : 10}, isActive: true}),
            BillModule.aggregate([
                { $match: { createdAt: {$gte : todayStart, $lte: todayEnd } } },
                { $group: { _id: null, revenue: { $sum: "$totalAmount"}, bills: { $sum: 1 } } }
            ]),
            ReturnModel.aggregate([
                { $match: { createdAt: { $gte: todayStart, $lte: todayEnd } } },
                { $group: { _id: null, refunds: { $sum: "$refundAmount" } } }
            ])
        ]);

        return res.status(200).json({
            message: "Dashboard summary fetch",
            totalMedicines,
            lowStockCount,
            todayBills: todayBills[0]?.bills || 0,
            totalRevenue: todayBills[0]?.revenue ||0,
            todayRefunds: todayReturns[0]?.refunds || 0,

        })
    } catch (error) {
        console.error("Dashboard summary error:", error);
        return res.status(500).json({ message: "Failed to fetch dashboard summary" });
    }
}



export const getSalesReport = async (req: Request, res: Response) => {
  try {
    const { fromDate, toDate } = req.query;
    if (!fromDate) {
      return res.status(400).json({ message: "fromDate is required" });
    }

    const from = new Date(fromDate as string);
    const to = toDate ? new Date(toDate as string) : new Date();

    if (isNaN(from.getTime()) || isNaN(to.getTime())) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    to.setHours(23, 59, 59, 999);

    const sales = await BillModule.aggregate([
      { $match: { createdAt: { $gte: from, $lte: to } } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
          totalBills: { $sum: 1 }
        }
      }
    ]);

    return res.status(200).json({
      message: "Sales report fetched",
      fromDate: from,
      toDate: to,
      totalRevenue: sales[0]?.totalRevenue || 0,
      totalBills: sales[0]?.totalBills || 0
    });
  } catch (error) {
    console.error("Sales report error:", error);
    return res.status(500).json({ message: "Failed to fetch sales report" });
  }
};


export const getTopSellingMedicines = async (req: Request, res: Response) => {
  try {
    const limit = Number(req.query.limit || 5);

    const topMedicines = await BillModule.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.medicineId",
          totalSold: { $sum: "$items.quantity" }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: "medicines",
          localField: "_id",
          foreignField: "_id",
          as: "medicine"
        }
      },
      { $unwind: "$medicine" },
      {
        $project: {
          _id: 0,
          medicineId: "$medicine._id",
          name: "$medicine.name",
          brand: "$medicine.brand",
          totalSold: 1
        }
      }
    ]);

    return res.status(200).json({
      message: "Top selling medicines fetched",
      data: topMedicines
    });
  } catch (error) {
    console.error("Top medicines error:", error);
    return res.status(500).json({ message: "Failed to fetch top medicines" });
  }
};


export const getLowStockReport = async (req: Request, res: Response) => {
  try {
    const threshold = Number(req.query.threshold || 10);

    const medicines = await MedicineModel.find({
      stock: { $lte: threshold },
      isActive: true
    }).sort({ stock: 1 });

    return res.status(200).json({
      message: "Low stock report fetched",
      count: medicines.length,
      medicines
    });
  } catch (error) {
    console.error("Low stock error:", error);
    return res.status(500).json({ message: "Failed to fetch low stock report" });
  }
};


export const getExpiryReport = async (req: Request, res: Response) => {
  try {
    const days = Number(req.query.days || 30);
    const today = new Date();
    const future = new Date();
    future.setDate(today.getDate() + days);

    const medicines = await MedicineModel.find({
      expiryDate: { $gte: today, $lte: future },
      isActive: true
    }).sort({ expiryDate: 1 });

    return res.status(200).json({
      message: "Expiry report fetched",
      days,
      count: medicines.length,
      medicines
    });
  } catch (error) {
    console.error("Expiry report error:", error);
    return res.status(500).json({ message: "Failed to fetch expiry report" });
  }
};

export const getRecentBills = async(req: Request, res: Response)=>{
  try {
    const recentBills = await BillModule.find().sort({createdAt: -1}).limit(5).select("billNumber customerName totalAmount paymentMode createdAt");
    return res.status(200).json({message: "Recent 5 bills fetched successfully", recentBills})
  } catch (error) {
    console.error("Recent bill error:", error);
    return res.status(500).json({ message: "Failed to fetch recent bills" });
  }
}