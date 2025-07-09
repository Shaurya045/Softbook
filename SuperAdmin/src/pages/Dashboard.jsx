import React from "react";
import AdminTable from "../component/AdminTable";

function Dashboard() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-[30px] font-semibold">Super Admin Dashboard</h1>
      <AdminTable />
    </div>
  );
}

export default Dashboard;
