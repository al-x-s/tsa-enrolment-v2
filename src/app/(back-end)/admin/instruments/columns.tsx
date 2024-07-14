"use client";
import Link from "next/link";
import { Instrument } from "@prisma/client";

// Tanstack Table
import { ColumnDef } from "@tanstack/react-table";
import {
  SortButton,
  currencyFilter,
  booleanFilter,
  arrayFilter,
} from "@/components/tables/tableUtils";

export const columns: ColumnDef<Instrument>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return <SortButton column={column} label="Name" />;
    },
    cell: ({ row }) => {
      const instrument = row.original as Instrument;
      const instrument_id: number = instrument.id;
      const instrument_name: string = row.getValue("name");
      const href = `/admin/instruments/${instrument_id}/general`;
      return (
        <Link className="text-blue-500 hover:text-red-600" href={href}>
          {instrument_name}
        </Link>
      );
    },
  },
  {
    id: "Program Type",
    accessorKey: "program_type",
    header: ({ column }) => {
      return <SortButton column={column} label="Program Type" />;
    },
  },
  {
    id: "Hireable",
    accessorKey: "can_hire",
    header: ({ column }) => {
      return <SortButton column={column} label="Can Hire?" />;
    },
    cell: ({ row }) => {
      const data: boolean = row.getValue("Hireable");
      return <div>{data === true ? "Yes" : "No"}</div>;
    },
    filterFn: booleanFilter(),
  },
  {
    id: "Hire Cost",
    accessorKey: "hire_cost",
    header: ({ column }) => {
      return <SortButton column={column} label="Hire Cost" />;
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("Hire Cost"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return <div>{formatted}</div>;
    },
    filterFn: currencyFilter(),
  },
  {
    id: "Hire Insurance",
    accessorKey: "hire_insurance",
    header: ({ column }) => {
      return <SortButton column={column} label="Hire Insurance" />;
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("Hire Insurance"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return <div>{formatted}</div>;
    },
    filterFn: currencyFilter(),
  },
  {
    accessorKey: "models",
    header: ({ column }) => {
      return <SortButton column={column} label="Models" />;
    },
    cell: ({ row }) => {
      const instrument = row.original as Instrument;
      const options: any = row.getValue("models");
      const id: number = instrument.id;

      return options.map((option: any, index: number) => (
        <Link
          href={`/admin/instruments/${id}/models/${option.model.id}`}
          className="text-blue-500 hover:text-red-600"
          key={crypto.randomUUID()}
        >
          {`${option.brand} ${option.model}`}
          {options.length - 1 === index ? "" : ", "}
        </Link>
      ));
    },
    filterFn: arrayFilter(["brand", "model"]),
  },
  {
    accessorKey: "accessories",
    header: ({ column }) => {
      return <SortButton column={column} label="Accessories" />;
    },
    cell: ({ row }) => {
      const instrument = row.original as Instrument;
      const options: any = row.getValue("accessories");
      const id: number = instrument.id;

      return options.map((option: any, index: number) => (
        <Link
          href={`/admin/instruments/${id}/accessories/${option.id}`}
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
