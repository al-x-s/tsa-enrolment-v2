"use client";
import Link from "next/link";

// Components
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
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
import { addProgram } from "@/lib/server_actions/back_end/dbQueries_PROGRAM";

// Types
import { Program } from "@prisma/client";
import { useToast } from "@/components/ui/use-toast";

// Tanstack
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const columnHelper = createColumnHelper<Program & { school_id: number }>();

function useAddProgram() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: addProgram,
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({
        queryKey: ["programsNotInSchool", data.schoolId],
      });
      queryClient.invalidateQueries({
        queryKey: ["programsInSchool", data.schoolId],
      });
    },
    onError: (error: any) => {
      toast({
        title: "Something went wrong ...!",
        description: error.message,
      });
    },
  });
}

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

      const { toast } = useToast();

      const addProgram = useAddProgram();

      const handleAdd = async (
        school_id: number,
        program_id: number,
        program_name: string
      ) => {
        addProgram.mutate(
          { school_id, program_id },
          {
            onSuccess: () => {
              toast({
                title: "Success!",
                description: `${program_name} added`,
              });
            },
          }
        );
      };

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
