import mongoose,{Schema, Types, Document} from "mongoose";


export interface Medicine extends Document {
  name: string;
  brand: string;
  category: Types.ObjectId;
  subCategory: Types.ObjectId;
  batchNumber: string;
  expiryDate: Date;
  price: number;
  stock: number;
  minStockAlert: number;
  isActive: boolean; 
};

const MedicineSchema : Schema<Medicine> = new Schema({
    name: {
        type:String,
        trim: true,
        required:[true, "Medicine name is required"]
    },
    brand: {
        type:String,
        trim: true,
        required:[true, "Medicine brand name is required"]
    },
    category: {
        type:mongoose.Schema.Types.ObjectId,
        ref: "Category",
         required:[true, "Category is required"]
    },
    subCategory: {
         type:mongoose.Schema.Types.ObjectId,
        ref: "SubCategory",
         required:[true, "Sub-Category is required"]
    },
    batchNumber: {
        type:String,
        trim: true,
        required:[true, "Batch Number is required"]
    },
    expiryDate:  {
        type:Date,
        required:[true, "Expiry Date is required"]
    },
    price: {
        type:Number,
        required:[true, "Price is required"]
    },
    stock: {
        type:Number,
        required:[true, "Stock is required"]
    },
    minStockAlert: {
        type:Number,
        default: 10
    },
    isActive: {
        type:Boolean,
       default: true,
    },
});

const MedicineModel = (mongoose.models.Medicine as mongoose.Model<Medicine>|| mongoose.model<Medicine>("Medicine", MedicineSchema))
export default MedicineModel