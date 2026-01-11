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

