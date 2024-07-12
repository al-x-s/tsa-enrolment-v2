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
import { updateSchoolProgram } from "@/lib/server_actions/back_end/dbQueries_PROGRAM";
import { toast } from "@/components/ui/use-toast";

const EditProgram = ({ ...props }) => {
  const formSchema = z.object({
    status: z.enum(["Active", "Inactive"]),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: props.status,
    },
  });

  const { formState, handleSubmit, reset } = form;
  const { isDirty, isSubmitting } = formState;

  const onSubmit = async (formData: z.infer<typeof formSchema>) => {
    console.log("submitted");
    const response: any = await updateSchoolProgram(
      formData,
      props.school_id,
      props.program_id
    );
    if (response.isSuccess) {
      toast({
        title: "Success!",
        description: `${props.program_name} updated`,
      });
    } else {
      toast({
        title: "Something went wrong...",
        description: response.issues,
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader>
          <CardTitle>Edit {props.program_name}</CardTitle>
        </CardHeader>
        <CardContent>
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="w-full pb-6">
                <div className="flex items-baseline justify-between">
                  <FormLabel className="text-black">Status</FormLabel>
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
                    {["Active", "Inactive"].map((item: string, index) => (
                      <SelectItem key={index} value={item} className="ml-3">
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <FormMessage />
                <FormDescription>
                  <span className="font-bold">Active:</span> This program is
                  available and can be selected.
                  <span className="font-bold">Inactive:</span> This program is
                  visible, but is labelled as "unavailable" and cannot be
                  selected.
                </FormDescription>
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
                Save
              </Button>
            </DialogClose>
          </div>
        </CardFooter>
      </form>
    </Form>
  );
};

export default EditProgram;
