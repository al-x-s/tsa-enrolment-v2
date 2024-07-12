import { QueryClient } from "@tanstack/react-query";
import { getProgram } from "@/lib/server_actions/back_end/dbQueries_PROGRAM";

export default async function ProgramDetailsLayout({ params, children }: any) {
  const program_id = parseInt(decodeURI(params.program_id));

  const queryClient = new QueryClient();

  const program_details = await queryClient.fetchQuery({
    queryKey: ["programs", program_id],
    queryFn: async () => {
      const data = await getProgram(program_id);
      return data;
    },
  });

  return (
    <div className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
      <div className="mx-auto grid w-full max-w-7xl gap-2">
        <h1 className="text-3xl font-semibold">
          Program - {program_details?.name}
        </h1>
      </div>
      <div className="mx-auto grid w-full max-w-7xl items-start gap-6 md:grid-cols-[400px_1fr] lg:grid-cols-[500px_1fr]">
        {children}
      </div>
    </div>
  );
}
