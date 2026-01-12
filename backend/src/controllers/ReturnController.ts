import { Request, Response } from "express";
import mongoose, { startSession } from "mongoose";
import MedicineModel from "../models/MedicineModel";
import BillModule from "../models/BillModule";
import ReturnModel from "../models/ReturnModel";


export const returnMedicine = async (req: Request, res: Response)=>{
    const session = await startSession();
    session.startTransaction()
    try {
        const {originalBillId, returnedItems, reason} = req.body;
        if(!originalBillId || !reason){
            await session.abortTransaction();
            session.endSession()
            return res.status(400).json({message: "All field are required"})
        }
        if(!Array.isArray(returnedItems) || returnedItems.length === 0){
            await session.abortTransaction();
            session.endSession()
            return res.status(400).json({message: "At least one refund item is required"})
        };
        if(!mongoose.Types.ObjectId.isValid(originalBillId)){
            await session.abortTransaction();
            session.endSession()
            return res.status(400).json({message: "Invalid Bill Number"})
        };

        for(let item of returnedItems){
            if(!item.medicineId || item.quantity <= 0){
                await session.abortTransaction();
                session.endSession()
                return res.status(400).json({message: "Each item must have medicineId, and quantity"})
            }
        }
        // fetch bill with bill id
        const bill = await BillModule.findById(originalBillId).session(session)
        if(!bill){
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({message:"Bill not found"})
        }

        // Recode <keyType, valueType>
        const soldItemsMap: Record< string,{ quantity: number; price: number }> = {};

        for (const item of bill.items) {
            soldItemsMap[item.medicineId.toString()] = {
            quantity: item.quantity,
            price: item.price,
        };
        }
        // FETCH PREVIOUS RETURNS FOR THIS BILL
        const previousReturns = await ReturnModel.find({ originalBillId }).session(session);

        const alreadyReturnedMap: Record<string, number> = {};
        for (const ret of previousReturns) {
            for (const item of ret.returnedItems) {
                const key = item.medicineId.toString();
                alreadyReturnedMap[key] = (alreadyReturnedMap[key] || 0) + item.quantity;
            }
        }
        // VALIDATE RETURN + CALCULATE REFUND
        let refundAmount = 0;
        const finalReturnedItems: {
            medicineId: mongoose.Types.ObjectId;
            quantity: number;
            price: number;
        }[] = [];
        

        for (let returnedItem of returnedItems){
            const key = returnedItem.medicineId.toString();
            const soldItem = soldItemsMap[key];
            if (!soldItem) {
                await session.abortTransaction();
                session.endSession();
                return res.status(400).json({ message: "Medicine not found in bill" });
            }

            const alreadyReturnedQty = alreadyReturnedMap[key] || 0;
            const totalAfterReturn = alreadyReturnedQty + returnedItem.quantity;

            if (totalAfterReturn > soldItem.quantity) {
                await session.abortTransaction();
                session.endSession();
                return res.status(400).json({message: "Return quantity exceeds sold quantity"});
            }
            
            const lineRefund = soldItem.price * returnedItem.quantity;
            refundAmount += lineRefund;

            finalReturnedItems.push({
                medicineId: returnedItem.medicineId,
                quantity: returnedItem.quantity,
                price: soldItem.price
            });
            
        }

        // ADD STOCK BACK
        for(const returnedItem of finalReturnedItems){
            await MedicineModel.findByIdAndUpdate(
                returnedItem.medicineId,
                { $inc: {
                    stock: returnedItem.quantity
                }},
                {session}
            )
            
        }

        // SAVE RETURN RECORD
        const returnRecord = await ReturnModel.create([
            {
                originalBillId: bill._id,
                returnedItems: finalReturnedItems,
                refundAmount,
                returnedBy : (req as any).user._id,
                reason
            }
        ], {session});

        bill.totalAmount = Math.max(0, bill.totalAmount - refundAmount);
        await bill.save({ session });

        await session.commitTransaction();
        session.endSession();

        return res.status(201).json({
            message: "Return processed successfully",
            refundAmount,
            returnId: returnRecord[0]._id
        });

    } catch (error) {
        await session.abortTransaction()
        session.endSession();
        console.log("Error In Refund Medicine", error)
        return res.status(500).json({message: "Server Error"})
    }
}