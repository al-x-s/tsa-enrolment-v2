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
import { addGrade } from "@/lib/server_actions/back_end/dbQueries_GRADE";

// Types
import { Grade } from "@prisma/client";
import { toast } from "@/components/ui/use-toast";

const columnHelper = createColumnHelper<Grade & { school_id: number }>();

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
  grade_id: number,
  grade_name: string
) => {
  const response: any = await addGrade(school_id, grade_id);
  if (response.isSuccess) {
    toast({
      title: "Success!",
      description: `${grade_name} added`,
    });
  } else {
    toast({
      title: "Something went wrong...",
      description: response.issues,
    });
  }
};

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
  columnHelper.display({
    id: "actions",
    cell: ({ row }) => {
      const grade = row.original as Grade & { school_id: number };
      const grade_id: number = grade.id;
      const school_id: number = grade.school_id;
      const grade_name: string = row.getValue("name");
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
              <DialogTitle>Add Grade</DialogTitle>
            </DialogHeader>
            <p>Are you sure you want to add {grade_name} to this school?</p>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="secondary">Cancel</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button
                  variant="default"
                  onClick={() => handleAdd(school_id, grade_id, grade_name)}
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
