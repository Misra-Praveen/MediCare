"use client";
import Logo from "../../../public/logo.png";
import Dashboard from "../../../public/dashboard.png";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartBar,
  faFileInvoiceDollar,
  faPills,
  faReply,
} from "@fortawesome/free-solid-svg-icons";

const SideBar = () => {
  const pathname = usePathname();

  const getNavClass = (path: string) => {
    const isActive = pathname === path;

    return `
      flex items-center gap-3 py-2 px-6 rounded-full font-semibold transition
      ${
        isActive
          ? "bg-slate-700 text-white shadow-md"
          : "bg-slate-300 text-slate-800 hover:bg-slate-700 hover:text-white"
      }
    `;
  };
  return (
    <aside className="w-60 min-h-screen bg-cyan-50 text-slate-800 p-4 shadow-lg shadow-cyan-900">
      <div className="flex justify-center items-center mb-6 rounded-xl shadow-md shadow-red-200">
        <Image src={Logo} alt="Medicare+" className="w-16" loading="eager" />
        <h1 className="text-xl font-bold underline underline-offset-4">
          Medicare
        </h1>
        <span className="font-bold p-1 text-xl text-red-500">+</span>
      </div>
      <nav className="flex flex-col gap-3 p-1">
        <button
          type="button"
          className={getNavClass("/dashboard")}
        >
          <Image
            src={Dashboard}
            alt="Dashboard"
            className="w-5 h-4 border-2 border-white rounded"
          />
          <span className="font-semibold">Dashboard</span>
        </button>
        <button
          type="button"
          className={getNavClass("/reports")}
        >
          <FontAwesomeIcon icon={faChartBar} />
          <span className="font-semibold">Reports</span>
        </button>
        <button
          type="button"
          className={getNavClass("/medicine")}
        >
          <FontAwesomeIcon icon={faPills} />
          <span className="font-semibold">Medicines</span>
        </button>
        <button
          type="button"
          className={getNavClass("/bill")}
        >
          <FontAwesomeIcon icon={faFileInvoiceDollar} />
          <span className="font-semibold">Billing</span>
        </button>
        <button
          type="button"
          className={getNavClass("/returns")}
        >
          <FontAwesomeIcon icon={faReply} />
          <span className="font-semibold">Returns</span>
        </button>
      </nav>
    </aside>
  );
};

export default SideBar;