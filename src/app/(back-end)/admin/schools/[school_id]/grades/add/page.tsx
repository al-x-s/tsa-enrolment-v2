"use client";
import React from "react";
import Link from "next/link";

// Tanstack Table
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/tables/data-table";
import { columns } from "./columns";

// DB Queries
import { getSchoolById } from "../../../../../../../lib/server_actions/back_end/dbQueries_SCHOOL";
import { getGradesNotInSchool } from "../../../../../../../lib/server_actions/back_end/dbQueries_GRADE";

// Components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import Loading from "@/components/tables/Loading";

const AddSchoolGrades = ({ params }: any) => {
  const school_id = parseInt(decodeURI(params.school_id));

  // Fetch page data
  const { data: school_details } = useQuery({
    queryKey: ["school", school_id],
    queryFn: async () => {
      const data = await getSchoolById({ school_id });
      return data;
    },
  });

  const {
    data: grades = [],
    error,
    isFetched,
    isPending,
  } = useQuery({
    queryKey: ["gradesNotInSchool", school_id, school_details?.state_territory],
    queryFn: async () => {
      const data = await getGradesNotInSchool(
        school_id,
        school_details?.state_territory!
      );
      return data;
    },
    enabled: !!school_details,
  });

  if (isPending) {
    return <Loading />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Grades</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={grades}>
          <Link
            className="h-10 px-4 py-2 rounded font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2  bg-sky-700 hover:bg-sky-900 text-white"
            prefetch={false}
            href={`/admin/schools/${school_id}/grades`}
          >
            <ChevronLeft />
          </Link>
          <Link
            className="h-10 px-4 py-2 rounded font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2  bg-sky-700 hover:bg-sky-900 text-white"
            prefetch={false}
            href={`/admin/grades/create`}
          >
            Create New Grade
          </Link>
        </DataTable>
      </CardContent>
    </Card>
  );
};

export default AddSchoolGrades;
