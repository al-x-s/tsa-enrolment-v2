"use client";
// Next
import Link from "next/link";

// Types
import { Accessory } from "@prisma/client";

// Tanstack Table
import { ColumnDef } from "@tanstack/react-table";

// Components
import {
  arrayFilter,
  booleanFilter,
  currencyFilter,
  SortButton,
} from "@/components/tables/tableUtils";

export const columns: ColumnDef<Accessory>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return <SortButton column={column} label="Name" />;
    },
    cell: ({ row }) => {
      const value: string = row.getValue("name");
      const accessory = row.original as Accessory;
      const href = `/admin/accessories/${accessory.id}`;
      return (
        <Link className="text-blue-500 hover:text-red-600" href={href}>
          {value}
        </Link>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return <SortButton column={column} label="Status" />;
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return <SortButton column={column} label="Price" />;
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("price"));

      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return <div>{formatted}</div>;
    },
    filterFn: currencyFilter(),
  },
  {
    id: "Reccomended",
    accessorKey: "is_recommended",
    header: ({ column }) => {
      return <SortButton column={column} label="Reccomended" />;
    },
    cell: ({ row }) => {
      const data: boolean = row.getValue("Reccomended");
      return <div>{data === true ? "Yes" : "No"}</div>;
    },
    filterFn: booleanFilter(),
  },
  {
    id: "Short Description",
    accessorKey: "description_short",
    header: ({ column }) => {
      return <SortButton column={column} label="Short Description" />;
    },
  },
  {
    id: "Long Description",
    accessorKey: "description_long",
    header: ({ column }) => {
      return <SortButton column={column} label="Long Description" />;
    },
  },
  {
    accessorKey: "instruments",
    header: ({ column }) => {
      return <SortButton column={column} label="Instruments" />;
    },
    cell: ({ row }) => {
      const options: any = row.getValue("instruments");

      return options.map((option: any, index: number) => (
        <Link
          href={`/admin/instruments/${option.name}`}
          className="text-blue-500 hover:text-red-600"
          key={crypto.randomUUID()}
        >
          {option.name}
          {options.length - 1 === index ? "" : ", "}
        </Link>
      ));
    },
    filterFn: arrayFilter(["name"]),
  },
];
