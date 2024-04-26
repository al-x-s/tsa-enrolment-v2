import { z } from "zod";
import React from "react";
import { Ubuntu } from "next/font/google";
import clsx from "clsx";
// Components
import Provider from "@/components/Provider";
import DataContextProvider from "@/lib/hooks/DataContextProvider";

import { FormDataSchema } from "@/lib/schema";

// import Form from "@/components/Form";
// Styles
import "@/app/globals.css";
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="font-ubuntu h-full flex flex-col justify-start lg:justify-center items-center">
        <main className="font-normal relative w-full max-w-lg lg:max-w-[940px] min-h-screen flex flex-col justify-start lg:justify-center items-center h-full">
          <div className=" w-full flex flex-col lg:flex-row px-4 lg:p-4 rounded-2xl h-[calc(100%-72px)] lg:h-4/5">
            <DataContextProvider>{children}</DataContextProvider>
          </div>
        </main>
      </body>
    </html>
  );
}
