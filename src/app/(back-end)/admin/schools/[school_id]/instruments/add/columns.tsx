"use client";
import Link from "next/link";

// Components
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SortButton } from "@/components/tables/tableUtils";

// Functions
import { addGrade } from "../../../../../../../lib/server_actions/back_end/dbQueries_GRADE";

// Types
import { Instrument } from "@prisma/client";
import { toast } from "@/components/ui/use-toast";
import { addInstrument } from "@/lib/server_actions/back_end/dbQueries_INSTRUMENT";

const columnHelper = createColumnHelper<Instrument & { school_id: number }>();

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
// export type Grade = {
//   id: number;
//   category: string;
//   name: string;
//   order: number;
//   state_territory: string;
// };

const handleAdd = async (
  school_id: number,
  instrument_id: number,
  instrument_name: string
) => {
  const response: any = await addInstrument(school_id, instrument_id);
  if (response.isSuccess) {
    toast({
      title: "Success!",
      description: `${instrument_name} added`,
    });
  } else {
    toast({
      title: "Something went wrong...",
      description: response.issues,
    });
  }
};

export const columns: ColumnDef<Instrument & { school_id: number }>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return <SortButton column={column} label="Name" />;
    },
    cell: ({ row }) => {
      const instrument = row.original as Instrument;
      const instrument_id: string = instrument.id.toString();
      const instrument_name: string = row.getValue("name");
      const href = `/admin/instruments/${instrument_id}/`;
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
  columnHelper.display({
    id: "actions",
    cell: ({ row }) => {
      const instrument = row.original as Instrument & { school_id: number };
      const instrument_id: number = instrument.id;
      const school_id: number = instrument.school_id;
      const instrument_name: string = row.getValue("name");
      return (
        <Dialog>
          <DialogTrigger asChild>
            <Button
              className="text-blue-500 hover:text-red-600"
              variant="outline"
            >
              Add
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Instrument</DialogTitle>
            </DialogHeader>
            <p>
              Are you sure you want to add {instrument_name} to this school?
            </p>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="secondary">Cancel</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button
                  variant="default"
                  onClick={() =>
                    handleAdd(school_id, instrument_id, instrument_name)
                  }
                >
                  Yes
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
    },
  }),
];
