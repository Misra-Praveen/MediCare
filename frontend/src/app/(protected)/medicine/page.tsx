"use client";
import axiosApi from "@/lib/axios";
import { useEffect, useState } from "react";
import Search from "../Search";

interface Medicine {
  _id: string;
  name: string;
  brand: string;
  batchNumber: string;
  price: number;
  stock: number;
  expiryDate: string;
  category: { name: string };
  subCategory: { name: string };
}

const MedicinePage = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const response = await axiosApi.get("/medicines", {
        params: { search },
      });
      const data = response.data;
      console.log(data);
      setMedicines(data.medicines || []);
    } catch (error) {
      console.log("Fetch medicines error:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchMedicines();
    }, 400); // debounce

    return () => clearTimeout(delay);
  }, [search]);

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Medicines</h1>
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600">
          + Add Medicine
        </button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <Search
          value={search}
          onChange={(val) => setSearch(val)}
          placeholder="Search medicines..."
        />
      </div>

      {/* Table*/}
      <div>
        <table className="min-w-full text-sm text-left">
          <thead className="bg-slate-100 text-gray-700">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Brand</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Batch</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Expiry</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="text-center py-6">
                  Loading...
                </td>
              </tr>
            ) : medicines.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-6 text-gray-500">
                  No medicines found
                </td>
              </tr>
            ) : (
              medicines.map((med) => (
                <tr
                  key={med._id}
                  className="border-b hover:bg-slate-50 transition"
                >
                  <td className="px-4 py-3 font-semibold">{med.name}</td>
                  <td className="px-4 py-3">{med.brand}</td>
                  <td className="px-4 py-3">{med.category?.name}</td>
                  <td className="px-4 py-3">{med.batchNumber}</td>
                  <td className="px-4 py-3">₹ {med.price}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        med.stock <= 10
                          ? "bg-red-100 text-red-600"
                          : "bg-green-100 text-green-600"
                      }`}
                    >
                      {med.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {new Date(med.expiryDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <button className="px-3 py-1 text-xs rounded bg-blue-400 text-white hover:bg-blue-500">
                      Edit
                    </button>
                    <button className="px-3 py-1 text-xs rounded bg-red-500 text-white hover:bg-red-600">
                      Disable
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MedicinePage;
