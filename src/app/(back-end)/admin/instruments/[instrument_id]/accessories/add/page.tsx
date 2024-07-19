"use client";
import React from "react";
import Link from "next/link";

// Tanstack Table
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/DataTable/data-table";
import { columns } from "./columns";

// DB Queries
import {
  getAccessoriesByInstrument,
  getAccessoriesNotLinkedToInstrument,
} from "@/lib/server_actions/back_end/dbQueries_ACCESSORY";

// Components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import Loading from "@/components/DataTable/Loading";

const AddInstrumentAccessory = ({ params }: any) => {
  const instrument_id = parseInt(decodeURI(params.instrument_id));

  // Fetch page data
  const { data: accessories = [], isPending } = useQuery({
    queryKey: ["accessoriesNotLinkedToInstrument", instrument_id],
    queryFn: async () => {
      const data = await getAccessoriesNotLinkedToInstrument(instrument_id);
      return data;
    },
  });

  if (isPending) {
    return <Loading />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Accessory</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={accessories}>
          <Link
            className="h-10 px-4 py-2 rounded font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2  bg-sky-700 hover:bg-sky-900 text-white"
            prefetch={false}
            href={`/admin/instruments/${instrument_id}/accessories`}
          >
            <ChevronLeft />
          </Link>
          <Link
            className="h-10 px-4 py-2 rounded font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2  bg-sky-700 hover:bg-sky-900 text-white"
            prefetch={false}
            href={`/admin/accessories/create`}
          >
            Create New Accessory
          </Link>
        </DataTable>
      </CardContent>
    </Card>
  );
};

export default AddInstrumentAccessory;
