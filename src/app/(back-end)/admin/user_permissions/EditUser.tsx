"use client";
import React from "react";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { updateGrade } from "@/lib/server_actions/back_end/dbQueries_GRADE";
import { updateUser } from "@/lib/server_actions/back_end/dbQueries_USER";
import { userSchema } from "@/lib/schemas/schema";

import { useMutation, useQueryClient } from "@tanstack/react-query";

function useUpdateUser() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: updateUser,
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

const EditUser = ({ ...props }) => {
  const { toast } = useToast();
  const updateUser = useUpdateUser();
  const user = props.user;
  const { username, email, role, id: user_id } = user;
  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: username,
      email: email,
      role: role,
    },
  });

  const { formState, handleSubmit, reset } = form;
  const { isDirty, isSubmitting } = formState;

  const onSubmit = async (formData: z.infer<typeof userSchema>) => {
    updateUser.mutate(
      { formData, user_id, field: "all" },
      {
        onSuccess: () => {
          toast({
            title: "Success!",
            description: `User updated`,
          });
        },
      }
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader>
          <CardTitle>Edit {username}</CardTitle>
        </CardHeader>
        <CardContent>
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="w-full pb-6">
                <div className="flex items-baseline justify-between">
                  <FormLabel className="text-black">Username</FormLabel>
                </div>
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
              <FormItem className="w-full pb-6">
                <div className="flex items-baseline justify-between">
                  <FormLabel className="text-black">Email</FormLabel>
                </div>
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
              <FormItem className="w-full pb-6">
                <div className="flex items-baseline justify-between">
                  <FormLabel className="text-black">Role</FormLabel>
                </div>

                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue defaultValue={field.value} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {["user", "admin"].map((item: string, index) => (
                      <SelectItem key={index} value={item} className="ml-3">
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
        <CardFooter className="border-t px-6 py-4 flex flex-row justify-between">
          <p className="italic">{props.description}</p>
          <div>
            <DialogClose asChild>
              <Button type="button" variant="secondary" onClick={() => reset()}>
                {isDirty ? "Cancel" : "Close"}
              </Button>
            </DialogClose>

            <DialogClose asChild>
              <Button disabled={!isDirty || isSubmitting} type="submit">
                Update
              </Button>
            </DialogClose>
          </div>
        </CardFooter>
      </form>
    </Form>
  );
};

export default EditUser;
