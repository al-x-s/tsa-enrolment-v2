import React from "react";
import prisma from "@/prisma/client";
import { Instrument } from "@prisma/client";
import { columns } from "./columns";
import { DataTable } from "@/components/DataTable/data-table";
import Link from "next/link";

async function getData(): Promise<Instrument[]> {
  try {
    const instruments = await prisma.instrument.findMany({
      include: {
        models: true,
        accessories: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return JSON.parse(JSON.stringify(instruments));
  } catch (error) {
    return JSON.parse(JSON.stringify(error));
  }
}

const InstrumentsPage = async () => {
  const data = await getData();

  return (
    <div className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
      <div className="mx-auto grid w-full max-w-6xl gap-2">
        <h1 className="text-3xl font-semibold">Instruments</h1>
      </div>
      <div className="mx-auto w-full max-w-6xl items-start gap-6">
        <DataTable columns={columns} data={data}>
          <Link
            className="h-10 px-4 py-2 rounded font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2  bg-sky-700 hover:bg-sky-900 text-white"
            href="/admin/instruments/create"
          >
            Create New Instrument
          </Link>
        </DataTable>
      </div>
    </div>
  );
};

export default InstrumentsPage;
