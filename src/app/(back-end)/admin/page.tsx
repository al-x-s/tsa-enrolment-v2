import React from "react";
import { redirect } from "next/navigation";

const AdminHome = () => {
  // TODO Currently learning towards not implementing a dashboard - would require a lot of db bandwith and is not requirement of the project but will leave file here for now in case a request is made

  redirect("/admin/schools");

  return <div className="text-red-500">Dashboard</div>;
};

export default AdminHome;
