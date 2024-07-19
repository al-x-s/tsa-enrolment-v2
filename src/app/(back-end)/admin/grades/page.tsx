import { DataTable } from "@/components/DataTable/data-table";
import Link from "next/link";
import { columns } from "./columns";
import { getGrades } from "@/lib/server_actions/back_end/dbQueries_GRADE";

const GradesPage = async () => {
  const data = await getGrades();

  return (
    <div className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
      <div className="mx-auto grid w-full max-w-6xl gap-2">
        <h1 className="text-3xl font-semibold">Grades</h1>
      </div>
      <div className="mx-auto w-full max-w-6xl items-start gap-6">
        <DataTable columns={columns} data={data}>
          <Link
            className="h-10 px-4 py-2 rounded font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2  bg-sky-700 hover:bg-sky-900 text-white"
            href="/admin/grades/create"
          >
            Create New Grade
          </Link>
        </DataTable>
      </div>
    </div>
  );
};

export default GradesPage;
