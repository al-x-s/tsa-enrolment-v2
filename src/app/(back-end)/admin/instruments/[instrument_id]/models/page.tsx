"use client";
import React from "react";

// Tanstack Table
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/tables/data-table";
import { columns } from "./columns";

// Db Queries
import { getInstrumentModels } from "@/lib/server_actions/back_end/dbQueries_INSTRUMENT";

// Components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Loading from "@/components/tables/Loading";
import Link from "next/link";

const InstrumentModels = ({ params }: any) => {
  const instrument_id = parseInt(decodeURI(params.instrument_id));

  // Fetch page data
  const { data: models, isPending } = useQuery({
    queryKey: ["getInstrumentModels", instrument_id],
    queryFn: async () => {
      const data = await getInstrumentModels(instrument_id);
      return data;
    },
  });

  if (isPending) {
    return <Loading />;
  }

  if (!models) {
    return;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Models</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={models}>
          <Link
            className="h-10 px-4 py-2 rounded font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2  bg-sky-700 hover:bg-sky-900 text-white"
            prefetch={false}
            href={`/admin/instruments/${instrument_id}/models/create`}
          >
            Create New Model
          </Link>
        </DataTable>
      </CardContent>
    </Card>
  );
};

export default InstrumentModels;
