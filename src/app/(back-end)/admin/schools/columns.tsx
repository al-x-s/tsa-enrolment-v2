"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type School = {
  id: string;
  name: string;
  programs: string[];
  resource_levy: number;
  facility_hire: number;
  offers_instrument_rental: boolean;
  instrument_options: object;
};

export const columns: ColumnDef<School>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="px-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="px-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const school_id: string = row.getValue("id");
      const school_name: string = row.getValue("name");
      const href = `/admin/schools/${school_id}/general`;
      return (
        <Link className="text-blue-500 hover:text-red-600" href={href}>
          {school_name}
        </Link>
      );
    },
  },
  {
    id: "Resource Levy",
    accessorKey: "resource_levy",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="px-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Resource Levy
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("Resource Levy"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return <div>{formatted}</div>;
    },
  },
  {
    id: "Facility Hire",
    accessorKey: "facility_hire",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="px-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Facility Hire
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("Facility Hire"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return <div>{formatted}</div>;
    },
  },
  {
    accessorKey: "programs",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="px-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Programs
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const options: any = row.getValue("programs");

      return options.map((option: any, index: number) => (
        <Link
          href={`/admin/programs/${option.program.name}`}
          className="text-blue-500 hover:text-red-600"
          key={crypto.randomUUID()}
        >
          {option.program.name}
          {options.length - 1 === index ? "" : ", "}
        </Link>
      ));
    },
  },
  {
    id: "Instrument Rental Available",
    accessorKey: "offers_instrument_rental",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="px-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Instrument Rental Available
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const data: boolean = row.getValue("Instrument Rental Available");
      return <div>{data === true ? "Yes" : "No"}</div>;
    },
  },
];
