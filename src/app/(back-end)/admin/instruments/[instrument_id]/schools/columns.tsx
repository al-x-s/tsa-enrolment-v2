"use client";
import Link from "next/link";
import { SortButton } from "@/components/tables/tableUtils";

// Components
import { ColumnDef } from "@tanstack/react-table";

// Types
import { School } from "@prisma/client";

export const columns: ColumnDef<School>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return <SortButton column={column} label="Name" />;
    },
    cell: ({ row }) => {
      const school = row.original as School;
      const school_id: number = school.id;
      const school_name: string = row.getValue("name");
      const href = `/admin/schools/${school_id}/instruments`;
      return (
        <Link className="text-blue-500 hover:text-red-600" href={href}>
          {school_name}
        </Link>
      );
    },
  },
  {
    id: "State or Territory",
    accessorKey: "state_territory",
    header: ({ column }) => {
      return <SortButton column={column} label="State or Territory" />;
    },
  },
];
