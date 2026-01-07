import { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken";
import UserModel from "../models/UserModel";

interface JwtPayload {
    id: string;
    role: string;
}

const protect = async (req: Request, res: Response, next: NextFunction) =>{
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if(!token){
            return res.status(401).json({message: "Unauthorized: Token not found"})
        }

        const decoded =  jwt.verify(token as string, process.env.JWT_SECRET as string) as JwtPayload

        const user = await UserModel.findById(decoded.id).select("-password")
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }
        (req as any ).user = user;
        next();


    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}
export default protect;