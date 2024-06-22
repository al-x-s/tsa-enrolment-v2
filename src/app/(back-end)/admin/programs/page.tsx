import React from "react";
import prisma from "@/prisma/client";
import { Program, columns } from "./columns";
import { DataTable } from "@/components/tables/data-table";
import Link from "next/link";

async function getData(): Promise<Program[]> {
  try {
    const programs = await prisma.program.findMany();

    return JSON.parse(JSON.stringify(programs));
  } catch (error) {
    return JSON.parse(JSON.stringify(error));
  }
}

const ProgramsPage = async () => {
  const data = await getData();

  return (
    <div className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
      <div className="mx-auto grid w-full max-w-6xl gap-2">
        <h1 className="text-3xl font-semibold">Programs</h1>
      </div>
      <div className="mx-auto w-full max-w-6xl items-start gap-6">
        <Link
          className="h-10 px-4 py-2 rounded font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2  bg-blue-700 hover:bg-blue-900 text-white"
          href="/admin/programs/add-new"
        >
          Add New Program
        </Link>
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
};

export default ProgramsPage;
