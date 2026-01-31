"use client"
import React, { useState } from "react";
import AddMedicine from "../AddMedicine";
import AddCategory from "../AddCategory";
import AddSubCategory from "../AddSubCategory";

type MasterType = "category" | "sub-category" | "medicine";

const MasterPage = () => {
  const [type, setType] = useState<MasterType>("category");

  return (
    <>
      <section className="flex items-center pt-1 px-3">
        <button
          className={`border border-gray-300 py-2 px-6 rounded-t-2xl 
          ${type == "category" ? "bg-cyan-800 text-white font-semibold" : "bg-slate-200 "}`}
          onClick={()=>setType("category")}
        >
          Category
        </button>
        <button
          className={`border border-gray-300 py-2 px-6 rounded-t-2xl 
          ${type == "sub-category" ? "bg-cyan-800 text-white font-semibold" : "bg-slate-200 "}`}
          onClick={() => setType("sub-category")}
        >
          Sub-Category
        </button>
        <button
          className={`border border-gray-300 py-2 px-6 rounded-t-2xl 
          ${type == "medicine" ? "bg-cyan-800 text-white font-semibold" : "bg-slate-200 "}`}
          onClick={() => setType("medicine")}
        >
          Medicine
        </button>
      </section>
      <section>
        {type == "category" ? (
          <AddCategory />
        ) : type == "sub-category" ? (
          <AddSubCategory />
        ) : (
          <AddMedicine />
        )}
      </section>
    </>
  );
};

export default MasterPage;
