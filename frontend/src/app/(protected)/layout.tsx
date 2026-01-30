"use client";

import SideBar from "./SideBar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <SideBar />
      <main className="flex-1 pt-3 pb-6 px-6">{children}</main>
    </div>
  );
}
