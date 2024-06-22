import prisma from "@/prisma/client";
import { SchoolData } from "@/lib/types";
import SchoolSidebar from "./SchoolSidebar";

async function getData(school_id: number): Promise<SchoolData> {
  try {
    const schools = await prisma.school.findFirst({
      where: {
        id: school_id,
      },
      include: {
        programs: { include: { program: true } },
      },
    });

    return JSON.parse(JSON.stringify(schools));
  } catch (error) {
    return JSON.parse(JSON.stringify(error));
  }
}

export default async function SchoolDetailsLayout({ params, children }: any) {
  const school_id = decodeURI(params.school_id);
  const school_details = await getData(parseInt(school_id));

  return (
    <div className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
      <div className="mx-auto grid w-full max-w-6xl gap-2">
        <h1 className="text-3xl font-semibold">{school_details.name}</h1>
      </div>
      <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
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
