"use client";
import React from "react";

// Tanstack Table
import { QueryClient, useQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/tables/data-table";
import { columns } from "./columns";

// Db Queries
import { getSchoolsByInstrument } from "@/lib/server_actions/back_end/dbQueries_SCHOOL";

// Components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Loading from "@/components/tables/Loading";

const InstrumentSchools = ({ params }: any) => {
  const instrument_id = parseInt(decodeURI(params.instrument_id));

  // Fetch page data
  const { data: schools, isPending } = useQuery({
    queryKey: ["schoolsWithInstrument", instrument_id],
    queryFn: async () => {
      const data = await getSchoolsByInstrument(instrument_id);
      return data;
    },
  });

  if (isPending) {
    return <Loading />;
  }

  if (!schools) {
    return;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Schools with Instrument</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={schools} />
      </CardContent>
    </Card>
  );
};

export default InstrumentSchools;
