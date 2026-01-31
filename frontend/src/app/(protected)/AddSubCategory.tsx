"use client";
import axiosApi from "@/lib/axios";
import React, { useState } from "react";

interface SubCategoryForm {
  name: string;
  description: string;
  isPrescriptionRequired: boolean;
  isActive: boolean;
}

const AddSubCategory = () => {
  const [form, setForm] = useState<SubCategoryForm>({ name: "", description: "", isPrescriptionRequired: false , isActive: true});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement |HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === "isPrescriptionRequired" ? value === "true" : value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.name.trim() || !form.description.trim()) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);
      const response = await axiosApi.post("/subcategory", form);

      if (!response.data) {
        setError("Error occurred while submitting form");
        return;
      }

      setSuccess("Sub-category  added successfully");
      setForm({ name: "", description: "", isPrescriptionRequired : false, isActive: true});
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
          Add Sub-Category
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
              Sub-Category Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              placeholder="Enter sub-category name"
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm 
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
             Sub Category Description
            </label>
            <textarea
              name="description"
              value={form.description}
              placeholder="Enter sub-category description"
              onChange={handleChange}
              rows={4}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
          {/* isPrescriptionRequired */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
             Prescription Required
            </label>
            <select
              name="isPrescriptionRequired"
              value={String(form.isPrescriptionRequired)}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none">
                         <option value="false">No</option>
                         <option value="true">Yes</option>
            </select>
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
            {loading ? "Submitting..." : "Add Sub-Category"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddSubCategory;
