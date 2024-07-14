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
  getProgramsBySchool,
  getProgramsNotInSchool,
} from "@/lib/server_actions/back_end/dbQueries_PROGRAM";

// Components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Loading from "@/components/tables/Loading";

const SchoolPrograms = ({ params }: any) => {
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
    data: programs = [],
    error,
    isFetched,
    isPending,
  } = useQuery({
    queryKey: ["programsInSchool", school_id],
    queryFn: async () => {
      const data = await getProgramsBySchool(school_id);
      return data;
    },
    enabled: !!school_details,
  });

  // prefetch data
  React.useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ["programsNotInSchool", school_id],
      queryFn: async () => {
        const data = await getProgramsNotInSchool(school_id);
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
        <CardTitle>Programs</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={programs}>
          <Link
            className="h-10 px-4 py-2 rounded font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2  bg-sky-700 hover:bg-sky-900 text-white"
            prefetch={false}
            href={`/admin/schools/${school_id}/programs/add`}
          >
            Add Programs
          </Link>
        </DataTable>
      </CardContent>
    </Card>
  );
};

export default SchoolPrograms;
