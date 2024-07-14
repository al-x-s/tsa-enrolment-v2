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
import { gradeSchema } from "@/lib/schema";
import { updateGrade } from "@/lib/server_actions/back_end/dbQueries_GRADE";

const EditGrade = ({ ...props }) => {
  const { toast } = useToast();
  const schema = gradeSchema.omit({ state_territory: true });
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: props.grade_name,
      category: props.category,
      order: props.order,
    },
  });

  const { formState, handleSubmit, reset } = form;
  const { isDirty, isSubmitting } = formState;

  const onSubmit = async (formData: z.infer<typeof schema>) => {
    const response: any = await updateGrade(formData, props.grade_id);
    if (response.isSuccess) {
      toast({
        title: "Success!",
        description: `${props.grade_name} updated`,
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
          <CardTitle>Edit {props.grade_name}</CardTitle>
        </CardHeader>
        <CardContent>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full pb-6">
                <div className="flex items-baseline justify-between">
                  <FormLabel className="text-black">Name</FormLabel>
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
            name="category"
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
                    {["Pre", "Primary", "Secondary", "Tertiary"].map(
                      (item: string, index) => (
                        <SelectItem key={index} value={item} className="ml-3">
                          {item}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="order"
            render={({ field }) => (
              <FormItem className="w-full pb-6">
                <div className="flex items-baseline justify-between">
                  <FormLabel className="text-black">Order</FormLabel>
                </div>
                <FormControl>
                  <Input
                    className="max-w-[300px]"
                    type="number"
                    {...field}
                    onChange={(event) => field.onChange(+event.target.value)}
                  />
                </FormControl>
                <FormMessage />
                <FormDescription>
                  This is the order that this grade will appear in relative to
                  other grades available at a school. If the grade is "Year 1"
                  set the order to "1", or for "Year 2" set it to "2". If the
                  grade is "Kindergarten", set to "0". Any Pre-School values
                  should be below 0, and similarly Tertiary values should in
                  most cases be above 12.
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

export default EditGrade;
