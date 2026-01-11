import mongoose, { Document, Schema, Types } from "mongoose";

interface BillItem {
  medicineId: Types.ObjectId;   // reference to Medicine
  quantity: number;             // number (calculation hoti hai)
  price: number;                // snapshot price at billing time
}

interface Bill extends Document {
    customerName: string;
    items: BillItem[];
    totalAmount : number;
    paymentMode: "CASH" | "UPI" | "CARD";
    billNumber: string;
    billedBy: Types.ObjectId;

}

const BillSchema: Schema<Bill> = new Schema({
    customerName:{
        type:String,
        trim: true,
        required: [true,"Customer Name is required"],
    },
    items:{
        type: [{
            medicineId: {
                type: Schema.Types.ObjectId,
                ref: "Medicine",
                required: [true, "Medicine id is required"]
            },
            quantity: {
                type: Number,
                required: true,
                min: 1,
            },
            price: {
                type: Number,
                required: true,
                min: 0,
            },
        }],

    },
    totalAmount: {
        type:Number,
        required: [true, "Total amount is required"],
        min: 0,
    },
    paymentMode: {
        type:String,
        enum: ["CASH", "UPI", "CARD"],
        required: true,
    },
    billNumber: {
        type:String,
        unique: true,
        required: [true, "Bill No is required"],
    },
    billedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true,"Billed By user is required"],
    },
}, {timestamps: true})

const BillModule = (mongoose.models.Bill as mongoose.Model<Bill> || mongoose.model<Bill>("Bill", BillSchema))
export default BillModule;