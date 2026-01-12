import mongoose, { Document, Schema, Types } from "mongoose";


export interface ReturnItem {
    medicineId: Types.ObjectId;
    quantity: number;
    price: number;
}
export interface Return extends Document{
    originalBillId: Types.ObjectId;
    returnedItems:  ReturnItem[];
    refundAmount: number;
    returnedBy: Types.ObjectId;
    reason: "DAMAGED" | "EXPIRED" | "CUSTOMER_RETURN" | "WRONG_BILL";
    createdAt: Date;
    updatedAt: Date;
};

const ReturnSchema: Schema<Return> = new Schema({
    originalBillId: {
        type: Schema.Types.ObjectId,
        ref: "Bill",
        required: [true, "Original Bill Id is required"]
    },
    returnedItems:  [{
        medicineId: {
            type: Schema.Types.ObjectId,
            ref: "Medicine",
            required: [true, "MedicineId is required"]
        },
        quantity: {
            type: Number,
            required: [true, "Quantity is required"],
            min: 1
        },
        price: {
            type: Number,
            required: [true, "Price is required"],
            min: 0
        }
    }],
    refundAmount: {
        type: Number,
        required: [true, "Refund Amount is required"],
        min: 0,
    },
    returnedBy: {
        type: Schema.Types.ObjectId,
        ref:"User",
        required: [true, "Returned By is required"]
    },
    reason: {
        type: String,
        required: [true, "Reason is required"],
        enum: ["DAMAGED" , "EXPIRED" , "CUSTOMER_RETURN" , "WRONG_BILL"]
    },

}, {timestamps: true})


const ReturnModel = (mongoose.models.Return as mongoose.Model<Return>   || mongoose.model<Return>("Return", ReturnSchema))
export default ReturnModel