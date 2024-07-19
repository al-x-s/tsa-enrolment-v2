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
import { SortButton } from "@/components/DataTable/tableUtils";

// Functions
import { addAccessory } from "@/lib/server_actions/back_end/dbQueries_ACCESSORY";

// Types
import { Accessory } from "@prisma/client";
import { useToast } from "@/components/ui/use-toast";

// Tanstack
import { useMutation, useQueryClient } from "@tanstack/react-query";

const columnHelper = createColumnHelper<
  Accessory & { instrument_id: number }
>();

function useAddAccessory() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: addAccessory,
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({
        queryKey: ["accessoriesByInstrument", data.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["accessoriesNotLinkedToInstrument", data.id],
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

export const columns: ColumnDef<Accessory & { instrument_id: number }>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return <SortButton column={column} label="Name" />;
    },
    cell: ({ row }) => {
      const accessory = row.original as Accessory;
      const accessory_name: string = row.getValue("name");
      const href = `/admin/accessories/${accessory.id}/`;
      return (
        <Link className="text-blue-500 hover:text-red-600" href={href}>
          {accessory_name}
        </Link>
      );
    },
  },
  {
    id: "Short Description",
    accessorKey: "description_short",
    header: ({ column }) => {
      return <SortButton column={column} label="Short Description" />;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return <SortButton column={column} label="Status" />;
    },
  },
  columnHelper.display({
    id: "actions",
    cell: ({ row }) => {
      const { toast } = useToast();
      const accessory = row.original as Accessory & { instrument_id: number };
      const accessory_id: number = accessory.id;
      const instrument_id: number = accessory.instrument_id;
      const accessory_name: string = row.getValue("name");

      const addAccessory = useAddAccessory();

      const handleAddAccessory = (
        instrument_id: number,
        accessory_id: number,
        accessory_name: string
      ) => {
        addAccessory.mutate(
          { instrument_id, accessory_id },
          {
            onSuccess: () =>
              toast({
                title: "Success!",
                description: `${accessory_name} added`,
              }),
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
              <DialogTitle>Add Accessory</DialogTitle>
            </DialogHeader>
            <p>
              Are you sure you want to add {accessory_name} to this instrument?
            </p>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="secondary">Cancel</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button
                  variant="default"
                  onClick={() =>
                    handleAddAccessory(
                      instrument_id,
                      accessory_id,
                      accessory_name
                    )
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
