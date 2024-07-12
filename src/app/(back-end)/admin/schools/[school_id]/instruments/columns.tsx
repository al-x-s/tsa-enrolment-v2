"use client";
import Link from "next/link";
import { SortButton } from "@/components/tables/tableUtils";

// Components
import { ColumnDef } from "@tanstack/react-table";
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
import { toast } from "@/components/ui/use-toast";
import EditInstrument from "./EditInstrument";

// Functions
import { removeInstrument } from "@/lib/server_actions/back_end/dbQueries_INSTRUMENT";

// Types
import { Instrument } from "@prisma/client";

const handleRemove = async (
  school_id: number,
  instrument_id: number,
  instrument_name: string
) => {
  const response: any = await removeInstrument(school_id, instrument_id);
  if (response.isSuccess) {
    toast({
      title: "Success!",
      description: `${instrument_name} removed`,
    });
  } else {
    toast({
      title: "Something went wrong...",
      description: response.issues,
    });
  }
};

export const columns: ColumnDef<
  Instrument & {
    school_id: number;
    status: string;
    cap: number;
    enrolled: number;
  }
>[] = [
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
  {
    accessorKey: "enrolled",
    header: ({ column }) => {
      return <SortButton column={column} label="Enrolled" />;
    },
  },
  {
    accessorKey: "cap",
    header: ({ column }) => {
      return <SortButton column={column} label="Cap" />;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return <SortButton column={column} label="Status" />;
    },
  },
  {
    id: "actions_edit",
    cell: ({ row }) => {
      const instrument = row.original as Instrument & { school_id: number };
      const instrument_id: number = instrument.id;
      const school_id: number = instrument.school_id;
      const instrument_name: string = row.getValue("name");
      const cap: number = row.getValue("cap");
      const status: number = row.getValue("status");
      const enrolled: string = row.getValue("enrolled");
      return (
        <Dialog>
          <DialogTrigger asChild>
            <Button className="rounded" variant="secondary">
              Edit
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <EditInstrument
              instrument_id={instrument_id}
              instrument_name={instrument_name}
              school_id={school_id}
              enrolled={enrolled}
              cap={cap}
              status={status}
            />
          </DialogContent>
        </Dialog>
      );
    },
  },
  {
    id: "actions_delete",
    cell: ({ row }) => {
      const instrument = row.original as Instrument & { school_id: number };
      const instrument_id: number = instrument.id;
      const school_id: number = instrument.school_id;
      const instrument_name: string = row.getValue("name");
      return (
        <Dialog>
          <DialogTrigger asChild>
            <Button className="rounded" variant="destructive">
              Remove
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Remove Instrument</DialogTitle>
            </DialogHeader>
            <p className="py2">
              Are you sure you want to remove {instrument_name} from this
              school?
            </p>
            <p className="py2">
              WARNING: This will also erase any data on the instrument cap and
              the number of students currently enrolled for {instrument_name} at
              this school.
            </p>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="secondary">Cancel</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button
                  variant="default"
                  onClick={() =>
                    handleRemove(school_id, instrument_id, instrument_name)
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
  },
];
