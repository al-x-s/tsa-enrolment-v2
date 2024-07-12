import SchoolSidebar from "./SchoolSidebar";

import { QueryClient } from "@tanstack/react-query";
import { getGradesBySchool } from "@/lib/server_actions/back_end/dbQueries_GRADE";
import { getSchoolById } from "@/lib/server_actions/back_end/dbQueries_SCHOOL";
import { getInstrumentsBySchool } from "@/lib/server_actions/back_end/dbQueries_INSTRUMENT";
import { getProgramsBySchool } from "@/lib/server_actions/back_end/dbQueries_PROGRAM";

export default async function SchoolDetailsLayout({ params, children }: any) {
  const school_id = parseInt(decodeURI(params.school_id));

  const queryClient = new QueryClient();

  // fetch page data
  const school_details = await queryClient.fetchQuery({
    queryKey: ["school", school_id],
    queryFn: async () => {
      const data = await getSchoolById({ school_id });
      return data;
    },
  });

  // pre-fetch data
  await queryClient.prefetchQuery({
    queryKey: ["grades", school_id],
    queryFn: async () => {
      const data = await getGradesBySchool(school_id);
      return data;
    },
  });

  await queryClient.prefetchQuery({
    queryKey: ["instruments", school_id],
    queryFn: async () => {
      const data = await getInstrumentsBySchool(school_id);
      return data;
    },
  });

  await queryClient.prefetchQuery({
    queryKey: ["programs", school_id],
    queryFn: async () => {
      const data = await getProgramsBySchool(school_id);
      return data;
    },
  });

  return (
    <div className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
      <div className="mx-auto grid w-full max-w-7xl gap-2">
        <h1 className="text-3xl font-semibold">{school_details?.name}</h1>
      </div>
      <div className="mx-auto grid w-full max-w-7xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
        <nav
          className="grid gap-4 text-sm text-muted-foreground"
          x-chunk="dashboard-04-chunk-0"
        >
          <SchoolSidebar school_id={school_id} />
        </nav>
        <div className="grid gap-6">{children}</div>
      </div>
    </div>
  );
}
