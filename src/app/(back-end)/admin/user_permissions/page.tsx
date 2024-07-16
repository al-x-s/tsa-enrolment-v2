"use client";
import React from "react";

// Components
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Zod and React Hook Form
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

// DB Queries
import {
  getUsers,
  updateUser,
} from "@/lib/server_actions/back_end/dbQueries_USER";
import getUser from "@/lib/server_actions/getUser";

// Tanstack
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/tables/data-table";
import { columns } from "./columns";
import { userSchema } from "@/lib/schema";

function useUpdateUser() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: updateUser,
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({
        queryKey: ["user"],
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

function CreateUser({ ...props }) {
  const { toast } = useToast();
  const updateUser = useUpdateUser();
  const { username, id } = props.user;

  const form = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: "",
      email: "",
      role: "user",
    },
  });

  const { reset, handleSubmit, formState } = form;
  const { isDirty, isSubmitting } = formState;

  const onSubmit = async (formData: z.infer<typeof userSchema>) => {
    updateUser.mutate(
      { formData, user_id: id, field: "username" },
      {
        onSuccess: () => {
          toast({
            title: "Success!",
            description: `Username updated`,
          }),
            reset({ username: formData.username });
        },
      }
    );
  };

  function capitalizeFirstLetter(value: string) {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  return (
    <Card id="create-user" x-chunk="dashboard-04-chunk-1">
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>Create New User</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="w-full pb-4">
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input className="max-w-[300px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="w-full pb-4">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input className="max-w-[300px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="md:w-1/2 pb-6">
                  <div className="flex items-baseline justify-between">
                    <FormLabel>Role</FormLabel>
                  </div>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="max-w-[200px]">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {["user", "admin"].map((item: any) => (
                        <SelectItem key={item} value={item} className="ml-3">
                          {capitalizeFirstLetter(item)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                  <FormDescription>
                    Only admin's can create and remove users
                  </FormDescription>
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="border-t px-6 py-4 flex flex-row justify-between">
            <p className="italic">Click create to create user</p>
            <div>
              {isDirty && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => reset()}
                >
                  Cancel
                </Button>
              )}

              <Button disabled={!isDirty || isSubmitting} type="submit">
                Create
              </Button>
            </div>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

function UserTable({ ...props }) {
  return (
    <>
      <Card id="user-table" x-chunk="dashboard-04-chunk-2">
        <CardHeader>
          <CardTitle>User Table</CardTitle>
          <CardDescription>
            View and edit permissions for all other users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={props.users} />
        </CardContent>
      </Card>
    </>
  );
}

const UserPermissionsPage = () => {
  // Fetch page data
  const {
    data: user,
    isPending: userIsPending,
    isError: userIsError,
  } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const data = await getUser();
      return data;
    },
  });

  if (userIsPending || userIsError) {
    return;
  }

  if (user.user === null) {
    return;
  }

  const {
    data: users,
    isError,
    isPending,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const data = await getUsers(user.user.id);
      return data;
    },
    enabled: !!user,
  });

  if (isPending || isError) {
    return;
  }

  return (
    <>
      <CreateUser user={user} />
      <UserTable users={users} />
    </>
  );
};
export default UserPermissionsPage;
