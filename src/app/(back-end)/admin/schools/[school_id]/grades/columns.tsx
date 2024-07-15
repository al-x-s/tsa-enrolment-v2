"use client";
import Link from "next/link";
import { SortButton } from "@/components/tables/tableUtils";

// Components
import { ColumnDef } from "@tanstack/react-table";

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

// Functions
import { removeGrade } from "@/lib/server_actions/back_end/dbQueries_GRADE";

// Types
import { Grade } from "@prisma/client";

// Tanstack
import { useMutation, useQueryClient } from "@tanstack/react-query";

function useRemoveGrade() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: removeGrade,
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({
        queryKey: ["gradesInSchool", data.schoolId],
      });
      queryClient.invalidateQueries({
        queryKey: ["gradesNotInSchool", data.schoolId],
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

export const columns: ColumnDef<Grade & { school_id: number }>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return <SortButton column={column} label="Name" />;
    },
    cell: ({ row }) => {
      const grade = row.original as Grade;
      const grade_id: string = grade.id.toString();
      const grade_name: string = row.getValue("name");
      const href = `/admin/grades/${grade_id}/`;
      return (
        <Link className="text-blue-500 hover:text-red-600" href={href}>
          {grade_name}
        </Link>
      );
    },
  },
  {
    accessorKey: "category",
    header: ({ column }) => {
      return <SortButton column={column} label="Category" />;
    },
  },
  {
    id: "State or Territory",
    accessorKey: "state_territory",
    header: ({ column }) => {
      return <SortButton column={column} label="State or Territory" />;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { toast } = useToast();
      const grade = row.original as Grade & { school_id: number };
      const grade_id: number = grade.id;
      const school_id: number = grade.school_id;
      const grade_name: string = row.getValue("name");

      const removeGrade = useRemoveGrade();

      const handleRemove = async (
        school_id: number,
        grade_id: number,
        grade_name: string
      ) => {
        removeGrade.mutate(
          { school_id, grade_id },
          {
            onSuccess: () =>
              toast({
                title: "Success!",
                description: `${grade_name} removed`,
              }),
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
              <DialogTitle>Remove Grade</DialogTitle>
            </DialogHeader>
            <p>
              Are you sure you want to remove {grade_name} from this school?
            </p>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="secondary">Cancel</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button
                  variant="default"
                  onClick={() => handleRemove(school_id, grade_id, grade_name)}
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
