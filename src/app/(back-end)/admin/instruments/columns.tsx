"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Instrument = {
  id: number;
  name: string;
  purchase_options: object;
  can_hire: boolean;
  hire_cost: number;
  hire_insurance: number;
  accessories: object;
};

export const columns: ColumnDef<Instrument>[] = [
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
    id: "Category",
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="px-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Category
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const value: string = row.getValue("Category");
      const href = `/admin/instruments/${value}`;
      return (
        <Link className="text-blue-500 hover:text-red-600" href={href}>
          {value}
        </Link>
      );
    },
  },
  {
    id: "Models",
    accessorKey: "purchase_options",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="px-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Models
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const options: any = row.getValue("Models");

      return options.map((option: any, index: number) => (
        <Link
          href={`/admin/programs/${option.model}`}
          className="text-blue-500 hover:text-red-600"
          key={crypto.randomUUID()}
        >
          {option.brand} {option.model}
          {options.length - 1 === index ? "" : ", "}
        </Link>
      ));
    },
  },
  {
    id: "Can Hire",
    accessorKey: "can_hire",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="px-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Can Hire
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const data: boolean = row.getValue("Can Hire");
      return <div>{data === true ? "Yes" : "No"}</div>;
    },
  },
  {
    id: "Hire Cost",
    accessorKey: "hire_cost",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="px-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Hire Cost
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const can_hire = row.getValue("Can Hire");
      if (can_hire) {
        const amount = parseFloat(row.getValue("Hire Cost"));
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount);
        return <div>{formatted}</div>;
      } else {
        return <div></div>;
      }
    },
  },
  {
    id: "Hire Insurance",
    accessorKey: "hire_insurance",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="px-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Hire Insurance
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const can_hire = row.getValue("Can Hire");
      if (can_hire) {
        const amount = parseFloat(row.getValue("Hire Insurance"));
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount);
        return <div>{formatted}</div>;
      } else {
        return <div></div>;
      }
    },
  },
  {
    accessorKey: "accessories",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="px-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Accessories
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const options: any = row.getValue("accessories");

      return options.map((option: any, index: number) => (
        <Link
          href={`/admin/accessories/${option.name}`}
          className="text-blue-500 hover:text-red-600"
          key={crypto.randomUUID()}
        >
          {option.name}
          {options.length - 1 === index ? "" : ", "}
        </Link>
      ));
    },
  },
];
