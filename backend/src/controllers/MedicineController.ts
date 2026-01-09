import { Request, Response } from "express";
import mongoose from "mongoose";
import MedicineModel from "../models/MedicineModel";
import CategoryModel from "../models/CategoryModel";
import SubCategoryModel from "../models/SubCategoryModel";


export const createMedicine = async (req: Request, res: Response)=>{
    try {
        const {name,brand, category, subCategory, batchNumber, expiryDate, price, stock, minStockAlert, isActive} = req.body;
        const userRole = (req as any).user?.role;
        if(userRole !== "ADMIN"){
            return res.status(403).send("UnAuthorized")
        }
        if (!name || !brand || !category || !subCategory || !batchNumber || !expiryDate || price === undefined || stock === undefined ) {
            return res.status(400).json({ message: "All required fields must be provided" });
        }

        // ObjectId validation
        if (!mongoose.Types.ObjectId.isValid(category) || !mongoose.Types.ObjectId.isValid(subCategory) ) {
            return res.status(400).json({ message: "Invalid category or subCategory id" });
        }

        // Category & SubCategory existence check
        const categoryExists = await CategoryModel.findById(category);
        const subCategoryExists = await SubCategoryModel.findById(subCategory);

        if (!categoryExists || !subCategoryExists) {
            return res.status(404).json({ message: "Category or SubCategory not found" });
        }
        
        const expDate = new Date(expiryDate);
        if (expDate <= new Date()) {
            return res.status(400).json({ message: "Expiry date must be in the future" });
        }

        if (price <= 0) {
            return res.status(400).json({ message: "Price must be greater than 0" });
        }

        if (stock < 0) {
            return res.status(400).json({ message: "Stock cannot be negative" });
        }

        if (minStockAlert !== undefined && minStockAlert < 0) {
            return res.status(400).json({ message: "Minimum stock alert cannot be negative" });
        }
        //Duplicate medicine check (same name + batch + category)
        const existingMedicine = await MedicineModel.findOne({ name, batchNumber, category });

        if (existingMedicine) {
        return res.status(409).json({
            message: "Medicine with same batch already exists",
        });
        }

        const newMedicine = new MedicineModel({
           name,brand, category, subCategory, batchNumber, expiryDate: expDate, price, stock, minStockAlert: minStockAlert ?? 10, isActive:isActive ?? true,})
        await newMedicine.save();
        return res.status(201).json({message: "Medicine Created Sucessfull", newMedicine})
    } catch (error) {
         return res.status(500).json({message: "Medicine Creation Failed"})
    }
}


export const updateMedicine = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userRole = (req as any).user?.role;
    if (userRole !== "ADMIN") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Validate medicine id
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid medicine id" });
    }

    const { name, brand, category, subCategory, batchNumber, expiryDate, price, stock, minStockAlert, isActive } = req.body;

    const updateData: any = {};

    if (name !== undefined) updateData.name = name;
    if (brand !== undefined) updateData.brand = brand;
    if (category !== undefined) updateData.category = category;
    if (subCategory !== undefined) updateData.subCategory = subCategory;
    if (batchNumber !== undefined) updateData.batchNumber = batchNumber;

    if (expiryDate !== undefined) {
      const expDate = new Date(expiryDate);
      if (expDate <= new Date()) {
        return res
          .status(400)
          .json({ message: "Expiry date must be in the future" }); 
      }
      updateData.expiryDate = expDate;
    }

    if (price !== undefined) {
      if (price <= 0) {
        return res
          .status(400)
          .json({ message: "Price must be greater than 0" });
      }
      updateData.price = price;
    }

    if (stock !== undefined) {
      if (stock < 0) {
        return res
          .status(400)
          .json({ message: "Stock cannot be negative" });
      }
      updateData.stock = stock;
    }

    if (minStockAlert !== undefined) {
      if (minStockAlert < 0) {
        return res
          .status(400)
          .json({ message: "Minimum stock alert cannot be negative" });
      }
      updateData.minStockAlert = minStockAlert;
    }

    if (isActive !== undefined) updateData.isActive = isActive;

    // Update medicine
    const updatedMedicine = await MedicineModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updatedMedicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    return res.status(200).json({
      message: "Medicine updated successfully",
      medicine: updatedMedicine,
    });

  } catch (error) {
    console.error("Update medicine error:", error);
    return res.status(500).json({ message: "Medicine update failed" });
  }
};

export const getMedicineAll = async (req: Request, res: Response)=>{
    try {
        const { search, category, subCategory, pageNo = "1", limit = "10" } = req.query;
        const limitNumber = Number(limit);
        const page = Number(pageNo);
        const skip = (page - 1) * limitNumber;
        let filter: any = {};
        if (search){
            filter.name = {$regex: search , $options: "i"}
        }
        if (category) {
            filter.category = category;
        }
        if (subCategory) {
            filter.subCategory = subCategory;
        }
        const medicines = await MedicineModel.find(filter).populate("category", "name").populate("subCategory", "name").skip(skip).limit(limitNumber).sort({ createdAt: -1 })
        const totalMedicines: number = await MedicineModel.countDocuments(filter)
        if (medicines.length === 0) {
            return res.status(404).json({ message: "No medicines found" })
        }
        return res.status(200).json({message : "Medicine fetch successful.", 
            currentPage: page,
            totalPages: Math.ceil(totalMedicines / limitNumber),
            medicines, totalMedicines
        })
    } catch (error) {
        console.error("Get medicines error:", error);
        return res.status(500).json({message: "Server Error"})
    }
}