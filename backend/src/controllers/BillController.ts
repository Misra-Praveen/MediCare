import { Request, Response } from "express";
import BillModule from "../models/BillModule";
import { generateBillNumber } from "../utils/generateBillNumber";
import mongoose ,{ startSession } from "mongoose";
import MedicineModel from "../models/MedicineModel";


export const createBill = async( req:Request, res: Response )=>{
    const session = await startSession();
    session.startTransaction()
    try {
        
        const {customerName, items, paymentMode} = req.body;
        if(!customerName || !paymentMode ){
            await session.abortTransaction();
            session.endSession()
            return res.status(400).json({message: "All field are required"})
        }
        if (!Array.isArray(items) || items.length === 0) {
            await session.abortTransaction();
            session.endSession()
            return res.status(400).json({ message: "At least one billing item is required" });
        }

        for (let item of items) {
            if (!item.medicineId || item.quantity === undefined) {
                await session.abortTransaction();
                session.endSession()
                return res.status(400).json({message: "Each item must have medicineId, price, and quantity"});
            }

            if (item.quantity <= 0) {
                await session.abortTransaction()
                session.endSession()
                return res.status(400).json({message: "Price and quantity must be greater than 0"});
            }
        }
        let totalAmount = 0;
        const billItems: {
            medicineId: mongoose.Types.ObjectId;
            quantity: number;
            price: number;
        }[] = [];

        for(let item of items){
            if(!mongoose.Types.ObjectId.isValid(item.medicineId)){
                await session.abortTransaction();
                session.endSession();
                return res.status(400).json({ message: "Invalid medicine id" });
            }

            const medicine = await MedicineModel.findById(item.medicineId).session(session)
            if(!medicine){
                await session.abortTransaction()
                session.endSession()
                return res.status(404).json({ message: "Medicine not found" });
            }
            if(!medicine.isActive){
                await session.abortTransaction()
                session.endSession()
                return res.status(400).json({message: `Medicine ${medicine.name} is inactive`})
            }
            if(medicine.stock < item.quantity){
                await session.abortTransaction()
                session.endSession()
                return res.status(400).json({message: `Insufficient stock for ${medicine.name}`, availableStock : medicine.stock})
            }
            const unitPrice = medicine.price;
            const lineTotal = unitPrice * item.quantity;
            totalAmount += lineTotal;

            billItems.push({ medicineId: medicine._id,  quantity: item.quantity,  price: unitPrice })
        }
        // Reduce stock
        for (let item of items) {
            await MedicineModel.findByIdAndUpdate(
            item.medicineId,
            { $inc: { stock: -item.quantity } },
            { session }
        );
        }
        const billNumber = await generateBillNumber()

        const newBill = new BillModule({
            customerName, items: billItems, paymentMode, billedBy: (req as any).user._id, billNumber, totalAmount
        });
        await newBill.save({session})
        await session.commitTransaction()
        session.endSession()
        return res.status(201).json({message: "Bill Created successfully", billNumber, totalAmount, newBill})
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        return res.status(500).json({message: "Failed to create bill"})
    }
}

export const getAllBills = async(req: Request, res: Response)=>{
    try {
        const { page = 1, limit = 10 }= req.query;
        const limitNumber = Number(limit);
        const currentPage = Number(page);
        const skip = (currentPage - 1) * limitNumber;
        

        const bills = await BillModule.find().skip(skip).limit(limitNumber).sort({createdAt : -1})
        if(bills.length === 0){
            return res.status(404).json({message: "No bills found"})
        }
        const totalBills = await BillModule.countDocuments();
        const totalPage = Math.ceil(totalBills/limitNumber)
        return res.status(200).json({message : "Bills fetch successfully", currentPage, totalPage, totalBills, bills})

    } catch (error) {
        console.error("Get bills error:", error);
        return res.status(500).json({message : "Bills fetch failed"})

    }
}

export const getBillsByDateRange = async(req: Request, res: Response)=>{
    try {
        const { fromDate, toDate, page = 1, limit = 10 }= req.query;
        if (!fromDate) {
            return res.status(400).json({ message: "fromDate is required" });
        }
        const limitNumber = Number(limit);
        const currentPage = Number(page);
        const skip = (currentPage - 1) * limitNumber;

        const from_Date =new  Date(fromDate as string)
        const to_Date = toDate ? new Date(toDate as string) : new Date();
        if (isNaN(from_Date.getTime()) || isNaN(to_Date.getTime())) {
            return res.status(400).json({ message: "Invalid date format" });
        }
        to_Date.setHours(23, 59, 59, 999)
        const dateFilter = {
            createdAt:{
                $gte: from_Date,
                $lte: to_Date
            }
        }

        const bills = await BillModule.find(dateFilter).skip(skip).limit(limitNumber).sort({createdAt : -1})
        if(bills.length === 0){
            return res.status(404).json({message: "No bills found"})
        }
        const totalBills = await BillModule.countDocuments(dateFilter);
        const totalPage = Math.ceil(totalBills/limitNumber)
        return res.status(200).json({message : "Bills fetch successfully", currentPage, totalPage, totalBills, bills})

    } catch (error) {
        console.error("Get bills by date error:", error);
        return res.status(500).json({message : "Bills fetch failed"})

    }
}


export const getDailySalesReport = async (req: Request, res: Response)=>{
    try {
        const { date }= req.query;
        
        const baseDate = date ? new Date(date as string) : new Date()
        if(isNaN(baseDate.getTime())) return res.status(400).json({ message: "Invalid date format" });
        const dayStart = new Date(baseDate)
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(baseDate)
        dayEnd.setHours(23, 59, 59, 999);

        const dateFilter = {
            createdAt:{
                $gte: dayStart,
                $lte: dayEnd
            }
        }
        const bills = await BillModule.find(dateFilter)
        if(bills.length===0) return res.status(400).json({message: "Bill not found"});

        let totalRevenue = 0;
        let totalItemsSold = 0;
        for(let bill of bills){
            totalRevenue += bill.totalAmount || 0;
            for(let item of bill.items){
                totalItemsSold += item.quantity
            }
        }
        return res.status(200).json({message: "Daily sales report generated successfully", date: dayStart.toISOString().split("T")[0], totalBills: bills.length, totalItemsSold, totalRevenue})

    } catch (error) {
        console.log("Error Occour: ", error)
        return res.status(500).json({message : "Error generating daily sales report"})
    }
}

export const getBillByBillNumber = async(req: Request, res: Response)=>{
    try {
        const { billNumber } = req.params;
        if(!billNumber){
            return res.status(400).json({message: "Bill Number is required"})
        }
        const bill = await BillModule.findOne({billNumber})
            .populate("billedBy", "username email role")
            .populate("items.medicineId", "name brand price");
        if(!bill){
            return res.status(400).json({message : "Invalid Bill Number"})
        }
        
        return res.status(200).json({
            message: "Bill Fetch Successfully",
            billNumber, bill
        })
    } catch (error) {
        console.log("Error Occour: ", error)
        return res.status(500).json({message : "Error generating report"})
    }
}