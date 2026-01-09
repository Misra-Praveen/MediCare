import { Request, Response } from "express";
import CategoryModel from "../models/CategoryModel";
import SubCategoryModel from "../models/SubCategoryModel";

export const createCategory = async (req: Request, res: Response)=>{
    try {
        const {name, description, isActive} = req.body;
        const userRole = (req as any).user?.role;
        if(userRole !== "ADMIN"){
            return res.status(403).send("UnAuthorized")
        }
        const newCategory = new CategoryModel({
            name, description,isActive
        })
        await newCategory.save();
        return res.status(201).json({message: "Category Created Sucessfull", newCategory})
    } catch (error) {
         return res.status(500).json({message: "Category Creation Failed"})
    }
}

export const createSubCategory = async (req: Request, res: Response)=>{
    try {
       const {name, description, isPrescriptionRequired, isActive} = req.body;
        const userRole = (req as any).user?.role;
        if(userRole !== "ADMIN"){
            return res.status(403).send("UnAuthorized")
        }
        const newSubCategory = new SubCategoryModel({
            name, description,isPrescriptionRequired,  isActive
        })
        await newSubCategory.save();
        return res.status(201).json({message: "SubCategory Created Sucessfull", newSubCategory})
    } catch (error) {
         return res.status(500).json({message: "SubCategory Creation Failed"})
    }
}