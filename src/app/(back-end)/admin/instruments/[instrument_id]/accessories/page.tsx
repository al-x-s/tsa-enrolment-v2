"use client";
import React from "react";
import Link from "next/link";

// Tanstack Table
import { useQuery, QueryClient } from "@tanstack/react-query";
import { DataTable } from "@/components/tables/data-table";
import { columns } from "./columns";

// Db Queries
import {
  getAccessoriesByInstrument,
  getAccessoriesNotLinkedToInstrument,
} from "@/lib/server_actions/back_end/dbQueries_ACCESSORY";

// Components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Loading from "@/components/tables/Loading";

const InstrumentAccessories = ({ params }: any) => {
  const instrument_id = parseInt(decodeURI(params.instrument_id));
  const queryClient = new QueryClient();

  // Fetch page data
  const {
    data: accessories = [],
    error,
    isFetched,
    isPending,
  } = useQuery({
    queryKey: ["accessoriesByInstrument", instrument_id],
    queryFn: async () => {
      const data = await getAccessoriesByInstrument(instrument_id);
      return data;
    },
  });

  // prefetch data
  React.useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ["accessoriesNotLinkedToInstrument", instrument_id],
      queryFn: async () => {
        const data = await getAccessoriesNotLinkedToInstrument(instrument_id);
        return data;
      },
    });
  }, []);

  if (isPending) {
    return <Loading />;
  }

  if (!accessories) {
    return;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Accessories</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={accessories}>
          <Link
            className="h-10 px-4 py-2 rounded font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2  bg-sky-700 hover:bg-sky-900 text-white"
            prefetch={false}
            href={`/admin/instruments/${instrument_id}/accessories/add`}
          >
            Add Accessory
          </Link>
        </DataTable>
      </CardContent>
    </Card>
  );
};

export default InstrumentAccessories;
