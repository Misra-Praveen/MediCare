import mongoose, { Schema, Document} from "mongoose"

interface Category extends Document{
    name: string;
    description?: string;
    isActive: boolean;
}

const CategorySchema: Schema<Category> =new Schema({
    name:{
        type:String,
        required: [true, "Category name is required"],
        unique: true,
        trim: true,
    },
    description:{
        type: String,
        trim: true,
    },
    isActive:{
        type: Boolean,
        default:true,
    }
}, {timestamps: true});


const CategoryModel = ( mongoose.models.Category as mongoose.Model<Category> || mongoose.model<Category>("Category", CategorySchema))

export default CategoryModel;