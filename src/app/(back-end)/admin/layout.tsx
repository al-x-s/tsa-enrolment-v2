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

import ReactQueryProvider from "@/lib/hooks/ReactQueryProviders";

// Components

// Styles
import "@/app/globals.css";
import NavBar from "./NavBar";

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
  const { user } = await validateRequest();

  if (!user) {
    return redirect("/login");
  }

  const queryClient = new QueryClient();

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
