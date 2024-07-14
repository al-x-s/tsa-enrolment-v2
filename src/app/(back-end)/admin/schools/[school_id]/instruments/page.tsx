"use client";
import React from "react";
import Link from "next/link";

// Tanstack Table
import { QueryClient, useQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/tables/data-table";
import { columns } from "./columns";

// Db Queries
import { getSchoolById } from "@/lib/server_actions/back_end/dbQueries_SCHOOL";
import {
  getInstrumentsBySchool,
  getInstrumentsNotInSchool,
} from "@/lib/server_actions/back_end/dbQueries_INSTRUMENT";

// Components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Loading from "@/components/tables/Loading";

const SchoolInstruments = ({ params }: any) => {
  const school_id = parseInt(decodeURI(params.school_id));
  const queryClient = new QueryClient();

  // Fetch page data
  const { data: school_details } = useQuery({
    queryKey: ["school", school_id],
    queryFn: async () => {
      const data = await getSchoolById({ school_id });
      return data;
    },
  });

  const {
    data: instruments = [],
    error,
    isFetched,
    isPending,
  } = useQuery({
    queryKey: ["instrumentsInSchool", school_id],
    queryFn: async () => {
      const data = await getInstrumentsBySchool(school_id);
      return data;
    },
    enabled: !!school_details,
  });

  // prefetch data
  React.useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ["instrumentsNotInSchool", school_id],
      queryFn: async () => {
        const data = await getInstrumentsNotInSchool(school_id);
        return data;
      },
    });
  }, [school_id, queryClient]);

  if (isPending) {
    return <Loading />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Instruments</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={instruments}>
          <Link
            className="h-10 px-4 py-2 rounded font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2  bg-sky-700 hover:bg-sky-900 text-white"
            prefetch={false}
            href={`/admin/schools/${school_id}/instruments/add`}
          >
            Add Instrument
          </Link>
        </DataTable>
      </CardContent>
    </Card>
  );
};

export default SchoolInstruments;
