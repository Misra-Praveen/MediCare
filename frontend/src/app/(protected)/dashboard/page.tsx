"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import axiosApi from "@/lib/axios";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';


interface User {
  username: string;
  email: string;
  role: string;
}
interface DashboardData {
  totalMedicines: number;
  lowStockCount: number;
  todayBills: number;
  totalRevenue: number;
  todayRefunds: number;
}
interface RecentBills {
  billNumber: number;
  customerName: string;
  paymentMode: string;
  totalAmount: number;
  createdAt: string;
}
interface SalesChartData {
  label: string;
  totalRevenue: number;
  totalBills: number;
}

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null,
  );
  const [salesChartReport, setSalesChartReport] = useState<SalesChartData[]>([])
  const [recentBills, setRecentBills] = useState<RecentBills[] | []>([]);
  const [error, setError] = useState("");
  const router = useRouter();

  const getAllDetailsForDashboard = async () => {
    try {
      const response = await axiosApi.get("/reports/dashboard/summary");
      const data = response.data;
      //console.log(data)
      setDashboardData(data);
    } catch (error: any) {
      console.log(error);
      setError(error);
    }
  };

  const getRecentBills = async () => {
    try {
      const response = await axiosApi.get("/reports/dashboard/recent-bills");
      const data = response.data.recentBills;
      // console.log(data);
      setRecentBills(data);
    } catch (error: any) {
      console.log(error);
      setError(error);
    }
  };
  const getTodaySaleReports = async ()=>{
    try {
      const fromDate = new Date()  // "2026-01-09"
      // console.log(fromDate)
      const response = await axiosApi.get("/reports/sales", {params : {fromDate}})
      // console.log(response.data)
      const data = response.data
      const chartData = [
        {
          label: "Today",
          totalRevenue: data.totalRevenue,
          totalBills: data.totalBills,
        }
      ]
      console.log(chartData)
      setSalesChartReport(chartData)
    } catch (error: any) {
      console.log(error);
      setError(error);
    }
  }
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!token || !storedUser) {
      router.push("/login");
      return;
    }

    setUser(JSON.parse(storedUser));
    getAllDetailsForDashboard();
    getRecentBills();
    getTodaySaleReports()
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-slate-100">

      <main className="flex-1 pt-3 pb-6 px-6">
        {/* Top Header */}
        <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border-l-4 border-blue-500">
          <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-700">
                <FontAwesomeIcon icon={faUser} className="mr-1" />
                {user.username}
              </p>
              <p className="text-xs text-gray-500">{user.role}</p>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-white bg-red-500 rounded hover:bg-red-600"
            >
              <FontAwesomeIcon icon={faRightFromBracket} />
              Logout
            </button>
          </div>
        </div>
        {error && <p className="text-sm text-red-500 font-semibold">{error}</p>}
        {/* Content Area */}
        {dashboardData && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-6">
            <DashboardCard
              title="Total Medicines"
              value={`${dashboardData?.totalMedicines}`}
              color="border-blue-500"
            />
            <DashboardCard
              title="Total Bills"
              value={`${dashboardData?.todayBills}`}
              color="border-green-500"
            />
            <DashboardCard
              title="Today's Sales"
              value={`₹ ${dashboardData?.totalRevenue}`}
              color="border-purple-500"
            />
            <DashboardCard
              title="Today's refund"
              value={`₹ ${dashboardData?.todayRefunds}`}
              color="border-indigo-500"
            />
            <DashboardCard
              title="Low Stock's"
              value={`${dashboardData?.lowStockCount}`}
              color="border-red-500"
            />
          </div>
        )}

        <section className="mt-8 w-full">
          <article className="bg-white rounded-2xl shadow-md border p-4 md:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-800">Sales Analytics</h2>
              <p className="text-sm text-gray-500">Today’s revenue & billing overview</p>
            </div>
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-orange-500"></span>
                <span className="text-gray-600">Revenue</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-green-600"></span>
                <span className="text-gray-600">Bills</span>
              </div>
            </div>
          </div>
          <div className="w-full h-52 sm:h-58 md:h-64 lg:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={salesChartReport}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} stroke="#6b7280" />
              <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
              <Tooltip contentStyle={{ backgroundColor: "#fff", borderRadius: "10px", border: "1px solid #e5e7eb", fontSize: "12px" }} labelStyle={{ fontWeight: "bold", color: "#111827" }}/>
              <Line type="monotone" dataKey="totalRevenue" stroke="#ff7300" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 7 }} name="Revenue" />
              <Line type="monotone" dataKey="totalBills" stroke="#387908" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 7 }} name="Bills" />
            </LineChart>
          
          </ResponsiveContainer>
           </div>  
      
          </article>
        </section>

        <section className="mt-8 bg-white rounded-xl shadow-sm  border-l-4 border-amber-300 overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-800">Recent Bills</h2>
          </div>

          {/* Responsive wrapper */}
          <article className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3">Bill No.</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Payment</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Date</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {recentBills.length > 0 ? (
                  recentBills.map((item) => (
                    <tr
                      key={item.billNumber}
                      className="hover:bg-blue-50 transition"
                    >
                      <td className="px-4 py-3 font-medium text-gray-800">
                        {item.billNumber}
                      </td>

                      <td className="px-4 py-3 text-gray-700">
                        {item.customerName}
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold
                  ${
                    item.paymentMode === "CASH"
                      ? "bg-green-100 text-green-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                        >
                          {item.paymentMode}
                        </span>
                      </td>

                      <td className="px-4 py-3 font-semibold text-gray-900">
                        ₹ {item.totalAmount.toLocaleString()}
                      </td>

                      <td className="px-4 py-3 text-gray-600">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-6 text-center text-gray-500"
                    >
                      No recent bills found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </article>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;

/* Card Component */
const DashboardCard = ({
  title,
  value,
  color = "border-blue-500",
}: {
  title: string;
  value: string;
  color?: string;
}) => {
  return (
    <div
      className={`bg-white p-5 rounded-xl shadow-sm border-l-4 ${color} hover:shadow-md transition`}
    >
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className="text-2xl font-bold text-gray-800 mt-2">
        {value.toLocaleString()}
      </h2>
    </div>
  );
};
