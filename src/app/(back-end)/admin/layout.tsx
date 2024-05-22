import { z } from "zod";
import React from "react";
import { Ubuntu } from "next/font/google";
import clsx from "clsx";
// import { auth } from "@/auth";
import { redirect } from "next/navigation";
// Components
import Provider from "@/components/Provider";
import DataContextProvider from "@/lib/hooks/DataContextProvider";

import { FormDataSchema } from "@/lib/schema";

// import Form from "@/components/Form";
// Styles
import "@/app/globals.css";
import NavBar from "./NavBar";
// import "@/stylesheets/fonts.css";

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
  // const session = await auth();

  // if (!session) {
  //   redirect("/api/auth/signin");
  // }

  return (
    <html lang="en" className="h-full">
      <body className="">
        <NavBar userName={"hello..."} />
        <main>{children}</main>
      </body>
    </html>
  );
}
