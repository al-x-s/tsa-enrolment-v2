import React from "react";
import { Ubuntu } from "next/font/google";

// Components
import FrontEndProvider from "@/components/Providers/FrontEndProvider";

// React Query
import { HydrationBoundary, QueryClient } from "@tanstack/react-query";

// Styles
import "@/app/globals.css";

// Data
import getSchoolNames from "@/lib/server_actions/front_end/getSchoolNames";

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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["schoolNames"],
    queryFn: async () => {
      const data = await getSchoolNames();
      return data;
    },
  });

  return (
    <html
      lang="en"
      className="h-full bg-[radial-gradient(_circle_at_-50%_-50%,#e6d3f9_0%,#e6d3f9_70%,#cea0f1_70%,#cea0f1_100%_)] lg:bg-[radial-gradient(_circle_at_-70%_50%,#e6d3f9_0%,#e6d3f9_70%,#cea0f1_70%,#cea0f1_100%_)]"
    >
      <body className="font-ubuntu h-full flex flex-col justify-start lg:justify-center items-center">
        <main className="font-normal relative w-full max-w-lg lg:max-w-[940px] min-h-screen flex flex-col justify-start lg:justify-center items-center h-full">
          <div className=" w-full flex flex-col lg:flex-row px-4 lg:p-4 rounded-2xl h-[calc(100%-72px)] lg:h-4/5">
            <FrontEndProvider>
              <HydrationBoundary>{children}</HydrationBoundary>
            </FrontEndProvider>
          </div>
        </main>
      </body>
    </html>
  );
}
