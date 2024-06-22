import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import React from "react";

const UserPermissionsPage = async () => {
  const { user } = await validateRequest();

  if (user?.role !== "admin") {
    return <div>You are not authorised to view this page</div>;
  }

  return <div>User Permissions Page</div>;
};

export default UserPermissionsPage;
