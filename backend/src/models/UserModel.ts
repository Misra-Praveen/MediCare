import mongoose, { Schema, Document} from "mongoose";
import bcrypt from "bcryptjs"

export interface User extends Document{
    username : string;
    email: string;
    password: string;
    role: "ADMIN" | "STAFF";
    comparePassword: (password: string) => Promise<boolean>;
}


const UserSchema: Schema<User> = new Schema({
    username:{
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    email:{   
        type: String,
        required: [true, "Email is required"],
        trim: true,
        match: [/.+\@.+\..+/, "Please use avalid email address"],
        unique: true,
        lowercase: true
    },
    password:{
        type: String,
        required: [true, "Password is required"],
        trim: true,
    },
    role:{
        type: String,
        enum: ["ADMIN", "STAFF"],
        default: "STAFF"
    }
    
}, { timestamps : true });

UserSchema.pre<User>("save", async function(){
    if(!this.isModified("password")) return ;
    this.password = await bcrypt.hash(this.password, 10);
})
UserSchema.methods.comparePassword = async function( enteredPassword: string ){
    return bcrypt.compare(enteredPassword, this.password);
}


const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema)
export default UserModel