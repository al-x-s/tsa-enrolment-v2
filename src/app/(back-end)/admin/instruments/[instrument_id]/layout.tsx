import Sidebar from "./Sidebar";

import { QueryClient } from "@tanstack/react-query";
import { getGradesBySchool } from "@/lib/server_actions/back_end/dbQueries_GRADE";

import {
  getInstrumentById,
  getInstrumentModels,
  getInstrumentsBySchool,
} from "@/lib/server_actions/back_end/dbQueries_INSTRUMENT";
import { getProgramsBySchool } from "@/lib/server_actions/back_end/dbQueries_PROGRAM";
import { getSchoolsByInstrument } from "@/lib/server_actions/back_end/dbQueries_SCHOOL";
import { getAccessoriesByInstrument } from "@/lib/server_actions/back_end/dbQueries_ACCESSORY";

export default async function InstrumentDetailsLayout({
  params,
  children,
}: any) {
  const instrument_id = parseInt(decodeURI(params.instrument_id));

  const queryClient = new QueryClient();

  // fetch page data
  const instrument = await queryClient.fetchQuery({
    queryKey: ["instrument", instrument_id],
    queryFn: async () => {
      const data = await getInstrumentById(instrument_id);
      return data;
    },
  });

  // pre-fetch data
  await queryClient.prefetchQuery({
    queryKey: ["getInstrumentModels", instrument_id],
    queryFn: async () => {
      const data = await getInstrumentModels(instrument_id);
      return data;
    },
  });

  await queryClient.prefetchQuery({
    queryKey: ["schoolsWithInstrument", instrument_id],
    queryFn: async () => {
      const data = await getSchoolsByInstrument(instrument_id);
      return data;
    },
  });

  await queryClient.prefetchQuery({
    queryKey: ["accessoriesByInstrument", instrument_id],
    queryFn: async () => {
      const data = await getAccessoriesByInstrument(instrument_id);
      return data;
    },
  });

  const links = [
    { segmentName: "general", label: "General" },
    { segmentName: "models", label: "Models" },
    { segmentName: "accessories", label: "Accessories" },
    { segmentName: "schools", label: "Schools" },
  ];

  return (
    <div className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
      <div className="mx-auto grid w-full max-w-7xl gap-2">
        <h1 className="text-3xl font-semibold">{instrument?.name}</h1>
      </div>
      <div className="mx-auto grid w-full max-w-7xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
        <nav
          className="grid gap-4 text-sm text-muted-foreground"
          x-chunk="dashboard-04-chunk-0"
        >
          <Sidebar id={instrument_id} links={links} />
        </nav>
        <div className="grid gap-6">{children}</div>
      </div>
    </div>
  );
}
