"use client";
import Link from "next/link";
import { currencyFilter, SortButton } from "@/components/DataTable/tableUtils";

// Components
import { ColumnDef } from "@tanstack/react-table";

// Types
import { Model } from "@prisma/client";

export const columns: ColumnDef<Model & { instrument_id: number }>[] = [
  {
    accessorKey: "model",
    header: ({ column }) => {
      return <SortButton column={column} label="Model" />;
    },
    cell: ({ row }) => {
      const model = row.original as Model & {
        instrument_id: number;
      };
      const instrument_id = model.instrument_id;
      const model_id: number = model.id;
      const model_name: string = row.getValue("model");
      const href = `/admin/instruments/${instrument_id}/models/${model_id}`;
      return (
        <Link className="text-blue-500 hover:text-red-600" href={href}>
          {model_name}
        </Link>
      );
    },
  },
  {
    accessorKey: "brand",
    header: ({ column }) => {
      return <SortButton column={column} label="Brand" />;
    },
  },
  {
    id: "Sale Price",
    accessorKey: "sale_price",
    header: ({ column }) => {
      return <SortButton column={column} label="Sale Price" />;
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("Sale Price"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return <div>{formatted}</div>;
    },
    filterFn: currencyFilter(),
  },
  {
    accessorKey: "rrp",
    header: ({ column }) => {
      return <SortButton column={column} label="RRP" />;
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("rrp"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return <div>{formatted}</div>;
    },
    filterFn: currencyFilter(),
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return <SortButton column={column} label="Status" />;
    },
  },
];
