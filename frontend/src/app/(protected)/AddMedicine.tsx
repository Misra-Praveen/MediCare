"use client";
import axiosApi from "@/lib/axios";
import { medicineBrands } from "@/utils/brand";
import React, { useEffect, useState } from "react";

interface Category {
  _id: string;
  name: string;
}

interface SubCategory {
  _id: string;
  name: string;
}

interface MedicineForm {
  name: string;
  brand: string;
  category: string;
  subCategory: string;
  batchNumber: string;
  expiryDate: string;
  price: number;
  stock: number;
  minStockAlert: number;
  isActive: boolean;
}

const AddMedicine = () => {
  const [form, setForm] = useState<MedicineForm>({
    name: "",
    brand: "",
    category: "",
    subCategory: "",
    batchNumber: "",
    expiryDate: "",
    price: 0,
    stock: 0,
    minStockAlert: 10,
    isActive: true,
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubCategories] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosApi.get("/category");
        //console.log(response.data.category)
        const categoriesData = response.data.category;
        setCategories(categoriesData || []);
      } catch (error) {
        console.log(error);
        setError("Error in fetch Categories in medicine");
      }
    };
    fetchCategories();
  }, []);
  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const response = await axiosApi.get("/subcategory");
        console.log(response.data.subcategory);
        const subCategoriesData = response.data.subcategory;
        setSubCategories(subCategoriesData || []);
      } catch (error) {
        console.log(error);
        setError("Error in fetch sub-categories in medicine");
      }
    };
    fetchSubCategories();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (
      !form.name.trim() ||
      !form.category.trim() ||
      !form.subCategory.trim() ||
      !form.batchNumber.trim() ||
      !form.brand.trim() ||
      !form.expiryDate.trim()
    ) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);
      const response = await axiosApi.post("/medicines", form);

      if (!response.data) {
        setError("Error occurred while submitting form");
        return;
      }

      setSuccess(response.data.message);
      setForm({
        name: "",
        brand: "",
        category: "",
        subCategory: "",
        batchNumber: "",
        expiryDate: "",
        price: 0,
        stock: 0,
        minStockAlert: 10,
        isActive: true,
      });
    } catch (error: any) {
      console.log(error);
      setError(error?.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-100 pt-0 pb-4 px-3">
      <div className="w-full max-w-md bg-white rounded-b-xl rounded-tr-xl shadow-xl p-6 border-b border-gray-300">
        <h2 className="text-xl font-bold text-gray-800 mb-4 text-center underline underline-offset-3">
          Add Medicine
        </h2>

        {error && (
          <p className="text-sm text-red-600 bg-red-100 border border-red-300 p-2 rounded mb-3 text-center">
            {error}
          </p>
        )}

        {success && (
          <p className="text-sm text-green-600 bg-green-100 border border-green-300 p-2 rounded mb-3 text-center">
            {success}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Medicine Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              placeholder="Enter medicine name"
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm 
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* brand */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Brand
            </label>
            <select
              name="brand"
              value={form.brand}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            >
              <option value="">---Select Please---</option>
              {medicineBrands.map((brand, index) => {
                return (
                  <option key={index} value={brand}>
                    {brand}
                  </option>
                );
              })}
            </select>
          </div>
          {/* category */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Category
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            >
              <option value="">---Select Please---</option>
              {categories.map((catogory) => {
                return (
                  <option key={catogory._id} value={catogory._id}>
                    {catogory.name}
                  </option>
                );
              })}
            </select>
          </div>
          {/* sub-category */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Sub Category
            </label>
            <select
              name="subCategory"
              value={form.subCategory}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            >
              <option value="">---Select Please---</option>
              {subcategories.map((scatogory) => {
                return (
                  <option key={scatogory._id} value={scatogory._id}>
                    {scatogory.name}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Batch No */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Batch Number
            </label>
            <input
              type="text"
              name="batchNumber"
              value={form.batchNumber}
              placeholder="Enter batch number"
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm 
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* Expiry Date */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Expiry Date
            </label>
            <input
              type="date"
              name="expiryDate"
              value={form.expiryDate}
              placeholder="Enter expiry date"
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm 
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* Price */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Price
            </label>
            <input
              type="number"
              name="price"
              value={form.price}
              placeholder="Enter Price"
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm 
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* Stock */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Stock
            </label>
            <input
              type="number"
              name="stock"
              value={form.stock}
              placeholder="Enter Stock"
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm 
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 font-semibold text-white rounded-lg transition
              ${
                loading
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              }
            `}
          >
            {loading ? "Submitting..." : "Add Medicine"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddMedicine;
