import { Request, Response } from "express";
import UserModel from "../models/UserModel"
import jwt from "jsonwebtoken";

export const register = async (req:Request, res:Response)=>{
    
    try {
        const {username, email, password, role} = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const existingUser = await UserModel.findOne({email})
        if(existingUser){
            return res.status(409).json({message:"Email already exist"})
        }
        const user = new UserModel({
            username,email, password, role: role==="ADMIN" ? "ADMIN" : "STAFF"
        })
        await user.save()
        res.status(201).json({message : "User registered susscessful", user:{
            id: user._id,
            username: user.username,
            role: user.role,
        }})
    } catch (error) {
        console.error("Register error:", error);
        res.status(500).json({ message: "Server error" });
    }
}

export const login =async (req: Request, res: Response)=>{
    try {
        const{username, email, password}= req.body;
        if ((!email && !username) || !password) {
          return res.status(400).json({ message: "Credentials are required" });
        }
        const user = await UserModel.findOne({$or:[{email: email},{username: username}]})
        if(!user){
            return res.status(404).json({message:"User not found"})
        }
        const isMatch = await user.comparePassword(password)
        if(!isMatch){
            return res.status(401).json({message:"Password InCorrect"})
        }
        const token = jwt.sign({id: user._id, role: user.role}, process.env.JWT_SECRET as string, {expiresIn: "1d"});
        return res.status(200).json({message: "successfully login",
        token,
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
        },
      })
        

    } catch (error) {
        console.error("Register error:", error);
        res.status(500).json({ message: "Server error" });
    }
}

export const getUserDetails = async (req:Request , res:Response) =>{
    try {
        const user = await UserModel.findById((req as any).user._id).select("-password");
        if(!user){
            return res.status(404).send("User Not Found")
        }
        return res.status(200).json({message: "User fetch successfully", user})
    } catch (error) {
        return res.status(500).send("Server Error: User fetch failed")
    }
} 