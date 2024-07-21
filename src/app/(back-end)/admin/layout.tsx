import React from "react";
import { Ubuntu } from "next/font/google";
import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import { Toaster } from "@/components/ui/toaster";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import ReactQueryProvider from "@/components/Providers/ReactQueryProviders";

// Components

// Styles
import "@/app/globals.css";
import NavBar from "./NavBar";
import getUser from "@/lib/server_actions/getUser";
import { is2faEnabled } from "@/lib/server_actions/twoFactorAuthentication";

export const metadata = {
  title: "TSA Enrolment",
  description: "Enrol your child in a TSA music program",
};

const ubuntu = Ubuntu({
  subsets: ["latin"],
  variable: "--font-ubuntu",
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = new QueryClient();

  // fetch page data
  const { user } = await queryClient.fetchQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const data = await getUser();
      return data;
    },
  });

  if (!user) {
    return redirect("/login");
  }

  // pre-fetch data
  await queryClient.prefetchQuery({
    queryKey: ["isUser2faEnabled"],
    queryFn: async () => {
      const data = await is2faEnabled();
      return data;
    },
  });

  return (
    <html lang="en" className="h-full">
      <body className="flex min-h-screen w-full flex-col">
        <ReactQueryProvider>
          <NavBar userName={user?.username} role={user?.role} />
          <HydrationBoundary state={dehydrate(queryClient)}>
            <main>{children}</main>
          </HydrationBoundary>
          <Toaster />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
