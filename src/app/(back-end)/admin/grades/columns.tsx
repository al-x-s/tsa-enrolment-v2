"use client";

// Tanstack Table
import { ColumnDef } from "@tanstack/react-table";
import { SortButton, currencyFilter } from "@/components/tables/tableUtils";

// Types
import { Grade } from "@prisma/client";

// Components
import { useToast } from "@/components/ui/use-toast";
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
import EditGrade from "./EditGrade";
import { deleteGrade } from "@/lib/server_actions/back_end/dbQueries_GRADE";

export const columns: ColumnDef<Grade>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return <SortButton column={column} label="Name" />;
    },
  },
  {
    id: "State Territory",
    accessorKey: "state_territory",
    header: ({ column }) => {
      return <SortButton column={column} label="State or Territory" />;
    },
  },
  {
    accessorKey: "category",
    header: ({ column }) => {
      return <SortButton column={column} label="Category" />;
    },
  },
  {
    accessorKey: "order",
    header: ({ column }) => {
      return <SortButton column={column} label="Order" />;
    },
    filterFn: currencyFilter(),
  },
  {
    id: "actions_edit",
    cell: ({ row }) => {
      const grade = row.original as Grade;
      const grade_id: number = grade.id;
      const grade_name: string = row.getValue("name");
      const category: string = row.getValue("category");
      const order: number = row.getValue("order");

      return (
        <Dialog>
          <DialogTrigger asChild>
            <Button className="rounded" variant="secondary">
              Edit
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <EditGrade
              grade_id={grade_id}
              grade_name={grade_name}
              category={category}
              order={order}
            />
          </DialogContent>
        </Dialog>
      );
    },
  },
  {
    id: "actions_delete",
    cell: ({ row }) => {
      const { toast } = useToast();
      const grade = row.original as Grade;
      const grade_id: number = grade.id;
      const grade_name: string = row.getValue("name");

      const handleDelete = async (grade_id: number, grade_name: string) => {
        const response: any = await deleteGrade(grade_id);
        if (response.isSuccess) {
          toast({
            title: "Success!",
            description: `${grade_name} removed`,
          });
        } else {
          toast({
            title: "Something went wrong...",
            description: response.issues,
          });
        }
      };

      return (
        <Dialog>
          <DialogTrigger asChild>
            <Button className="rounded" variant="destructive">
              Delete
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Delete Grade</DialogTitle>
            </DialogHeader>
            <p className="py2">Are you sure you want to delete {grade_name}?</p>
            <p className="py2">WARNING: This cannot be undone.</p>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="secondary">Cancel</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button
                  variant="default"
                  onClick={() => handleDelete(grade_id, grade_name)}
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
