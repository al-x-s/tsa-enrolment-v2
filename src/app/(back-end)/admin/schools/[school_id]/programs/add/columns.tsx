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
import { Program } from "@prisma/client";
import { toast } from "@/components/ui/use-toast";
import { addProgram } from "@/lib/server_actions/back_end/dbQueries_PROGRAM";

const columnHelper = createColumnHelper<Program & { school_id: number }>();

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
  program_id: number,
  program_name: string
) => {
  const response: any = await addProgram(school_id, program_id);
  if (response.isSuccess) {
    toast({
      title: "Success!",
      description: `${program_name} added`,
    });
  } else {
    toast({
      title: "Something went wrong...",
      description: response.issues,
    });
  }
};

export const columns: ColumnDef<Program & { school_id: number }>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return <SortButton column={column} label="Name" />;
    },
    cell: ({ row }) => {
      const program = row.original as Program;
      const program_id: string = program.id.toString();
      const program_name: string = row.getValue("name");
      const href = `/admin/programs/${program_id}/`;
      return (
        <Link className="text-blue-500 hover:text-red-600" href={href}>
          {program_name}
        </Link>
      );
    },
  },
  {
    id: "Program Type",
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
  columnHelper.display({
    id: "actions",
    cell: ({ row }) => {
      const program = row.original as Program & { school_id: number };
      const program_id: number = program.id;
      const school_id: number = program.school_id;
      const program_name: string = row.getValue("name");
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
              <DialogTitle>Add Program</DialogTitle>
            </DialogHeader>
            <p>Are you sure you want to add {program_name} to this school?</p>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="secondary">Cancel</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button
                  variant="default"
                  onClick={() => handleAdd(school_id, program_id, program_name)}
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
