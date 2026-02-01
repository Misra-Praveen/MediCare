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
  isActive: boolean;
  category: { name: string };
  subCategory: { name: string };
}

const MedicinePage = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  /* ---------------- FETCH ---------------- */
  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const res = await axiosApi.get("/medicines", {
        params: {
          search,
          pageNo: currentPage,
          limit: 10,
        },
      });
      setMedicines(res.data.medicines || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(fetchMedicines, 400);
    return () => clearTimeout(delay);
  }, [search, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  /* ---------------- EDIT ---------------- */
  const handleEdit = (med: Medicine) => {
    setEditingId(med._id);
    setEditForm({
      name: med.name,
      brand: med.brand,
      price: med.price,
      stock: med.stock,
    });
  };

  const handleEditChange = (e: any) => {
    const { name, value } = e.target;
    setEditForm((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (id: string) => {
    try {
      await axiosApi.put(`/medicines/${id}`, editForm);
      setEditingId(null);
      fetchMedicines();
    } catch (err) {
      console.log(err);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  /* ---------------- ENABLE / DISABLE ---------------- */
  const toggleActive = async (id: string, isActive: boolean) => {
    try {
      await axiosApi.put(`/medicines/${id}`, { isActive: !isActive });
      fetchMedicines();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Medicines</h1>
      </div>

      {/* SEARCH */}
      <div className="mb-4">
        <Search
          value={search}
          onChange={(val) => setSearch(val)}
          placeholder="Search medicines..."
        />
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100 text-gray-700">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Brand</th>
              <th className="p-3">Category</th>
              <th className="p-3">Batch</th>
              <th className="p-3">Price</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Expiry</th>
              <th className="p-3">Action</th>
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
                <td colSpan={8} className="text-center py-6">
                  No medicines found
                </td>
              </tr>
            ) : (
              medicines.map((med) => (
                <tr key={med._id} className="border-b hover:bg-slate-50">
                  {/* NAME */}
                  <td className="p-3">
                    {editingId === med._id ? (
                      <input
                        name="name"
                        value={editForm.name}
                        onChange={handleEditChange}
                        className="border px-2 py-1 rounded"
                      />
                    ) : (
                      med.name
                    )}
                  </td>

                  {/* BRAND */}
                  <td className="p-3">
                    {editingId === med._id ? (
                      <input
                        name="brand"
                        value={editForm.brand}
                        onChange={handleEditChange}
                        className="border px-2 py-1 rounded"
                      />
                    ) : (
                      med.brand
                    )}
                  </td>

                  <td className="p-3">{med.category?.name}</td>
                  <td className="p-3">{med.batchNumber}</td>

                  {/* PRICE */}
                  <td className="p-3">
                    {editingId === med._id ? (
                      <input
                        name="price"
                        type="number"
                        value={editForm.price}
                        onChange={handleEditChange}
                        className="border px-2 py-1 rounded w-20"
                      />
                    ) : (
                      `₹ ${med.price}`
                    )}
                  </td>

                  {/* STOCK */}
                  <td className="p-3">
                    {editingId === med._id ? (
                      <input
                        name="stock"
                        type="number"
                        value={editForm.stock}
                        onChange={handleEditChange}
                        className="border px-2 py-1 rounded w-16"
                      />
                    ) : (
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          med.stock <= 10
                            ? "bg-red-100 text-red-600"
                            : "bg-green-100 text-green-600"
                        }`}
                      >
                        {med.stock}
                      </span>
                    )}
                  </td>

                  <td className="p-3">
                    {new Date(med.expiryDate).toLocaleDateString()}
                  </td>

                  {/* ACTION */}
                  <td className="p-3 flex gap-2">
                    {editingId === med._id ? (
                      <>
                        <button
                          onClick={() => handleUpdate(med._id)}
                          className="px-3 py-1 bg-green-500 text-white rounded"
                        >
                          Update
                        </button>
                        <button
                          onClick={handleCancel}
                          className="px-3 py-1 bg-gray-400 text-white rounded"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit(med)}
                          className="px-3 py-1 bg-blue-500 text-white rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => toggleActive(med._id, med.isActive)}
                          className={`px-3 py-1 text-white rounded ${
                            med.isActive ? "bg-red-500" : "bg-green-500"
                          }`}
                        >
                          {med.isActive ? "Disable" : "Enable"}
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end items-center gap-2 mt-6">
        {/* PREV */}
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-40"
        >
          Prev
        </button>

        {/* PAGE NUMBERS */}
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-3 py-1 rounded ${
              currentPage === page ? "bg-blue-500 text-white" : "bg-gray-100"
            }`}
          >
            {page}
          </button>
        ))}

        {/* NEXT */}
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default MedicinePage;
