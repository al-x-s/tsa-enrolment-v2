import Link from "next/link";
import React from "react";
import getUser from "@/lib/server_actions/getUser";
import { getUsers } from "@/lib/server_actions/back_end/dbQueries_USER";

// Tanstack
import { QueryClient } from "@tanstack/react-query";

const UserPermissionsLayout = async ({ children }: any) => {
  const queryClient = new QueryClient();
  // Fetch page data
  const { user } = await queryClient.fetchQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const data = await getUser();
      return data;
    },
  });

  if (!user) {
    return;
  }
  // Pre-fetch data
  await queryClient.prefetchQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const data = await getUsers(user.id);
      return data;
    },
  });

  if (user.role !== "admin") {
    return <p className="text-destructive text-2xl">Access Denied</p>;
  }

  return (
    <div className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
      <div className="mx-auto grid w-full max-w-6xl gap-2">
        <h1 className="text-3xl font-semibold">Users</h1>
      </div>
      <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
        <nav
          className="grid gap-4 text-sm text-muted-foreground"
          x-chunk="dashboard-04-chunk-0"
        >
          <Link href="#create-user" className="font-semibold text-primary">
            Create User
          </Link>
          <Link href="#user-table">User Table</Link>
        </nav>
        <div className="grid gap-6">{children}</div>
      </div>
    </div>
  );
};

export default UserPermissionsLayout;
