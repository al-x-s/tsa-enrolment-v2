"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Program } from "@prisma/client";
import Link from "next/link";
import { currencyFilter, SortButton } from "@/components/DataTable/tableUtils";

export const columns: ColumnDef<Program>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return <SortButton column={column} label="Name" />;
    },
    cell: ({ row }) => {
      const value: string = row.getValue("name");
      const program = row.original as Program;

      const href = `/admin/programs/${program.id}`;
      return (
        <Link className="text-blue-500 hover:text-red-600" href={href}>
          {value}
        </Link>
      );
    },
  },
  {
    accessorKey: "description",
    header: ({ column }) => {
      return <SortButton column={column} label="Description" />;
    },
  },
  {
    accessorKey: "tuition_fee",
    header: ({ column }) => {
      return <SortButton column={column} label="Tuition Fee" />;
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("tuition_fee"));

      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return <div>{formatted}</div>;
    },
    filterFn: currencyFilter(),
  },
  {
    accessorKey: "rehearsal_fee",
    header: ({ column }) => {
      return <SortButton column={column} label="Rehearsal Fee" />;
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("rehearsal_fee"));

      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return <div>{formatted}</div>;
    },
    filterFn: currencyFilter(),
  },
  {
    id: "Enrolment Fee",
    accessorKey: "enrol_fee",
    header: ({ column }) => {
      return <SortButton column={column} label="Enrolment Fee" />;
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("Enrolment Fee"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return <div>{formatted}</div>;
    },
    filterFn: currencyFilter(),
  },
  {
    accessorKey: "type",
    header: ({ column }) => {
      return <SortButton column={column} label="Program Type" />;
    },
  },
  {
    id: "Class Type",
    accessorKey: "classType",
    header: ({ column }) => {
      return <SortButton column={column} label="Class Type" />;
    },
  },
  {
    id: "Status",
    accessorKey: "program_status",
    header: ({ column }) => {
      return <SortButton column={column} label="Status" />;
    },
  },
];
