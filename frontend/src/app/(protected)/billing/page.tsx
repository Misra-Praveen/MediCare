"use client";

import axiosApi from "@/lib/axios";
import { useEffect, useState } from "react";
import Search from "../Search";

interface Medicine {
  _id: string;
  name: string;
  brand: string;
  price: number;
  stock: number;
}

interface CartItem extends Medicine {
  quantity: number;
}

const BillingPage = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [qtyMap, setQtyMap] = useState<{ [key: string]: number }>({});
  const [customerName, setCustomerName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    const delay = setTimeout(fetchMedicines, 400);
    return () => clearTimeout(delay);
  },[search])

  const fetchMedicines = async()=>{
   try {
    setLoading(true)
    const respose = await axiosApi.get("/medicines", {
      params: {search}
    })
    console.log(respose.data)
    setMedicines(respose.data.medicines || [])
   } catch (error) {
    console.log(error)
   } finally{
    setLoading(false)
   }
  }

  const addToCart = (med: Medicine)=>{
    const qty = qtyMap[med._id] || 1;
    const exist = cart.find((c)=> c._id === med._id)

    if(exist){
      setCart(
        cart.map((c)=> c._id === med._id ? {
          ...c, quantity: Math.min(c.quantity + qty, med.stock),
        } : c )
      )
    }else {
      setCart([...cart, { ...med, quantity: qty }]);
    }

  }

  /* ---------------- UPDATE QTY ---------------- */
  const updateQty = (id: string, value: number) => {
    setCart(
      cart.map((c) =>
        c._id === id ? { ...c, quantity: Math.max(1, value) } : c
      )
    );
  };

  /* ---------------- REMOVE ---------------- */
  const removeItem = (id: string) => {
    setCart(cart.filter((c) => c._id !== id));
  };

  /* ---------------- TOTAL ---------------- */
  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleGenerateBill = async () => {
    if (!customerName.trim()) {
      alert("Customer name required");
      return;
    }

    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }

    try {
      const payload = {
        customerName,
        items: cart.map((item) => ({
          medicineId: item._id,
          quantity: item.quantity,
          price: item.price,
        })),
        totalAmount,
        paymentMode: "CASH",
      };

      const response = await axiosApi.post("/billing", payload);

      alert("Bill Generated Successfully ✅");

      // reset
      setCart([]);
      setCustomerName("");
    } catch (error: any) {
      console.log(error);
      alert(error?.response?.data?.message || "Bill failed");
    }
  };

  

  return (
    <div className="p-6 grid md:grid-cols-2 gap-6">
      {/* Medicine */}
      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="text-xl font-bold mb-4">Medicines</h2>

        <Search
          value={search}
          onChange={(v) => setSearch(v)}
          placeholder="Search medicine..."
        />

        {loading && <p className="mt-3">Loading...</p>}

        <div className="space-y-3 mt-4 max-h-100 overflow-y-auto">
          {medicines.map((m) => (
            <div
              key={m._id}
              className="border p-3 rounded-lg flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{m.name}</p>
                <p className="text-sm text-gray-500">
                  ₹ {m.price} | Stock {m.stock}
                </p>
              </div>

              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  min={1}
                  max={m.stock}
                  value={qtyMap[m._id] || 1}
                  onChange={(e) =>
                    setQtyMap({
                      ...qtyMap,
                      [m._id]: Number(e.target.value),
                    })
                  }
                  className="w-16 border p-1 rounded text-center"
                />

                <button
                  onClick={() => addToCart(m)}
                  disabled={(qtyMap[m._id] > m.stock)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  Add
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Cart */}
      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="text-xl font-bold mb-4">Cart</h2>

        <input
          type="text"
          placeholder="Customer Name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          className="w-full border p-2 rounded mb-4"
        />

        <div className="space-y-3 max-h-87.5 overflow-y-auto">
          {cart.map((item) => (
            <div
              key={item._id}
              className="border p-3 rounded flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm">₹ {item.price}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQty(item._id, item.quantity - 1)}
                  className="px-2 bg-gray-200 rounded"
                >
                  -
                </button>

                <span>{item.quantity}</span>

                <button
                  onClick={() => updateQty(item._id, item.quantity + 1)}
                  className="px-2 bg-gray-200 rounded"
                >
                  +
                </button>

                <button
                  onClick={() => removeItem(item._id)}
                  className="text-red-500 ml-2"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* TOTAL */}
        <div className="mt-4 border-t pt-3 flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>₹ {totalAmount}</span>
        </div>

        <button 
        onClick={handleGenerateBill}
        className="w-full mt-4 bg-green-500 text-white py-2 rounded hover:bg-green-600">
          Generate Bill
        </button>
      </div>
    </div>
  );
};

export default BillingPage;