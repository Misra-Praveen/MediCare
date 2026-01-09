import mongoose, {Schema, Document} from "mongoose";

interface SubCategory extends Document {
    name: string;
    description?: string;
    isPrescriptionRequired: boolean;
    isActive: boolean;
}

const SubCategorySchema :Schema<SubCategory> = new Schema({
    name: {
        type: String,
        required: [true, "Sub-Category name is required"],
        unique: true,
        trim: true,
    },
    description:{
        type: String,
        trim: true,
    },
    isPrescriptionRequired:{
        type: Boolean,
        default: false,
    },
    isActive:{
        type: Boolean,
        default:true,
    }
}, {timestamps: true})


const SubCategoryModel = (mongoose.models.SubCategory as mongoose.Model<SubCategory> || mongoose.model<SubCategory>("SubCategory", SubCategorySchema))

export default SubCategoryModel;