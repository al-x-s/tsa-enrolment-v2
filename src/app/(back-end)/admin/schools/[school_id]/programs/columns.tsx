"use client";
import Link from "next/link";
import { SortButton } from "@/components/DataTable/tableUtils";

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
import { useToast } from "@/components/ui/use-toast";
import EditProgram from "./EditProgram";

// Functions
import { removeProgram } from "@/lib/server_actions/back_end/dbQueries_PROGRAM";

// Types
import { Program } from "@prisma/client";

// Tanstack
import { useMutation, useQueryClient } from "@tanstack/react-query";

function useRemoveProgram() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: removeProgram,
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({
        queryKey: ["programsInSchool", data.schoolId],
      });
      queryClient.invalidateQueries({
        queryKey: ["programsNotInSchool", data.schoolId],
      });
    },
    onError: (error: any) => {
      toast({
        title: "Something went wrong...",
        description: error.message,
      });
    },
  });
}

export const columns: ColumnDef<
  Program & {
    school_id: number;
    status: string;
  }
>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return <SortButton column={column} label="Name" />;
    },
    cell: ({ row }) => {
      const instrument = row.original as Program;
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
    accessorKey: "status",
    header: ({ column }) => {
      return <SortButton column={column} label="Status" />;
    },
  },
  {
    id: "actions_edit",
    cell: ({ row }) => {
      const program = row.original as Program & { school_id: number };
      const program_id: number = program.id;
      const school_id: number = program.school_id;
      const program_name: string = row.getValue("name");

      const status: number = row.getValue("status");

      return (
        <Dialog>
          <DialogTrigger asChild>
            <Button className="rounded" variant="secondary">
              Edit
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <EditProgram
              program_id={program_id}
              program_name={program_name}
              school_id={school_id}
              status={status}
            />
          </DialogContent>
        </Dialog>
      );
    },
  },
  {
    id: "actions_remove",
    cell: ({ row }) => {
      const program = row.original as Program & { school_id: number };
      const program_id: number = program.id;
      const school_id: number = program.school_id;
      const program_name: string = row.getValue("name");
      const { toast } = useToast();

      const removeProgram = useRemoveProgram();

      const handleRemove = async (
        school_id: number,
        program_id: number,
        program_name: string
      ) => {
        removeProgram.mutate(
          { school_id, program_id },
          {
            onSuccess: () => {
              toast({
                title: "Success!",
                description: `${program_name} removed`,
              });
            },
          }
        );
      };

      return (
        <Dialog>
          <DialogTrigger asChild>
            <Button className="rounded" variant="destructive">
              Remove
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Remove Program</DialogTitle>
            </DialogHeader>
            <p className="py2">
              Are you sure you want to remove {program_name} from this school?
            </p>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="secondary">Cancel</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button
                  variant="default"
                  onClick={() =>
                    handleRemove(school_id, program_id, program_name)
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
