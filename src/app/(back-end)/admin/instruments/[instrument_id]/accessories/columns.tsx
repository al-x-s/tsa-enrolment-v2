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
import { removeAccessory } from "@/lib/server_actions/back_end/dbQueries_ACCESSORY";

// Types
import { Accessory } from "@prisma/client";

// Tanstack
import { useMutation, useQueryClient } from "@tanstack/react-query";

function useRemoveAccessory() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: removeAccessory,
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

export const columns: ColumnDef<
  (Accessory & { instrument_id: number }) | undefined
>[] = [
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
  {
    id: "actions",
    cell: ({ row }) => {
      const { toast } = useToast();
      const accessory = row.original as Accessory & { instrument_id: number };
      const accessory_id: number = accessory.id;
      const instrument_id: number = accessory.instrument_id;
      const accessory_name: string = row.getValue("name");

      const removeAccessory = useRemoveAccessory();

      const handleRemove = async (
        instrument_id: number,
        accessory_id: number,
        accessory_name: string
      ) => {
        removeAccessory.mutate(
          { instrument_id, accessory_id },
          {
            onSuccess: () =>
              toast({
                title: "Success!",
                description: `${accessory_name} removed`,
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
              <DialogTitle>Remove Accessory</DialogTitle>
            </DialogHeader>
            <p>
              Are you sure you want to remove {accessory_name} from this
              instrument?
            </p>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="secondary">Cancel</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button
                  variant="default"
                  onClick={() =>
                    handleRemove(instrument_id, accessory_id, accessory_name)
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
