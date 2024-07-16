"use client";
// React Query and Db Queries
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUser } from "@/lib/server_actions/back_end/dbQueries_USER";

// Components
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

// Tanstack Table
import { ColumnDef } from "@tanstack/react-table";
import { SortButton } from "@/components/tables/tableUtils";
import EditUser from "./EditUser";
import { deleteUser } from "@/lib/server_actions/back_end/dbQueries_USER";

type User = {
  id: string;
  username: string;
  email: string;
  role: string;
};

function useDeleteUser() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
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

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "username",
    header: ({ column }) => {
      return <SortButton column={column} label="Username" />;
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return <SortButton column={column} label="Email" />;
    },
  },
  {
    accessorKey: "role",
    header: ({ column }) => {
      return <SortButton column={column} label="Role" />;
    },
  },
  {
    id: "actions_edit",
    cell: ({ row }) => {
      const user = row.original as User;

      return (
        <Dialog>
          <DialogTrigger asChild>
            <Button className="rounded" variant="secondary">
              Edit
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <EditUser user={user} />
          </DialogContent>
        </Dialog>
      );
    },
  },
  {
    id: "actions_delete",
    cell: ({ row }) => {
      const deleteUser = useDeleteUser();
      const { toast } = useToast();
      const user = row.original as User;
      const target_id: string = user.id;

      const target_name: string = user.username;

      const handleDelete = async (target_id: string, target_name: string) => {
        deleteUser.mutate(
          { target_id },
          {
            onSuccess: () => {
              toast({
                title: "Success!",
                description: `${target_name} deleted`,
              });
            },
          }
        );
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
              <DialogTitle>Delete user</DialogTitle>
            </DialogHeader>
            <p className="py2">
              Are you sure you want to delete {target_name}?
            </p>
            <p className="py2">WARNING: This cannot be undone.</p>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="secondary">Cancel</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button
                  variant="default"
                  onClick={() => handleDelete(target_id, target_name)}
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
