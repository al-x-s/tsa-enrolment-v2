import React from "react";
import { Ubuntu } from "next/font/google";
import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";

// Styles
import "@/app/globals.css";

export const metadata = {
  title: "Login",
  description: "TSA Enrolment Login",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className="h-full" lang="en">
      <body className="h-full">{children}</body>
    </html>
  );
}
