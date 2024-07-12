"use client";
import Link from "next/link";

// Tanstack Table
import { ColumnDef } from "@tanstack/react-table";
import {
  SortButton,
  currencyFilter,
  booleanFilter,
  arrayFilter,
} from "@/components/tables/tableUtils";

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
    accessorKey: "name",
    header: ({ column }) => {
      return <SortButton column={column} label="Name" />;
    },
    cell: ({ row }) => {
      const school = row.original as School;
      const school_id: string = school.id;
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
      return <SortButton column={column} label="Resource Levy" />;
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("Resource Levy"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return <div>{formatted}</div>;
    },
    filterFn: currencyFilter(),
  },
  {
    id: "Facility Hire",
    accessorKey: "facility_hire",
    header: ({ column }) => {
      return <SortButton column={column} label="Facility Hire" />;
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("Facility Hire"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return <div>{formatted}</div>;
    },
    filterFn: currencyFilter(),
  },
  {
    accessorKey: "programs",
    header: ({ column }) => {
      return <SortButton column={column} label="Programs" />;
    },
    cell: ({ row }) => {
      const options: any = row.getValue("programs");

      return options.map((option: any, index: number) => (
        <Link
          href={`/admin/programs/${option.program.id}`}
          className="text-blue-500 hover:text-red-600"
          key={crypto.randomUUID()}
        >
          {option.program.name}
          {options.length - 1 === index ? "" : ", "}
        </Link>
      ));
    },
    filterFn: arrayFilter(),
  },
  {
    id: "Instrument Rental Available",
    accessorKey: "offers_instrument_rental",
    header: ({ column }) => {
      return <SortButton column={column} label="Instrument Rental Available" />;
    },
    cell: ({ row }) => {
      const data: boolean = row.getValue("Instrument Rental Available");
      return <div>{data === true ? "Yes" : "No"}</div>;
    },
    filterFn: booleanFilter(),
  },
];
