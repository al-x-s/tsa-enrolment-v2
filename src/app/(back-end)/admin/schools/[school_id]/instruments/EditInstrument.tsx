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
import { School } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { updateSchoolInstrument } from "@/lib/server_actions/back_end/dbQueries_INSTRUMENT";
import { toast } from "@/components/ui/use-toast";

const EditInstrument = ({ ...props }) => {
  const formSchema = z.object({
    enrolled: z.number(),
    cap: z.number(),
    status: z.enum(["Available", "Unavailable", "Hidden"]),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      enrolled: props.enrolled,
      cap: props.cap,
      status: props.status,
    },
  });

  const { formState, handleSubmit, reset } = form;
  const { isDirty, isSubmitting } = formState;

  const onSubmit = async (formData: z.infer<typeof formSchema>) => {
    console.log("submitted");
    const response: any = await updateSchoolInstrument(
      formData,
      props.school_id,
      props.instrument_id
    );
    if (response.isSuccess) {
      toast({
        title: "Success!",
        description: `${props.instrument_name} updated`,
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
          <CardTitle>Edit {props.instrument_name}</CardTitle>
        </CardHeader>
        <CardContent>
          <FormField
            control={form.control}
            name="enrolled"
            render={({ field }) => (
              <FormItem className="w-full pb-6">
                <div className="flex items-baseline justify-between">
                  <FormLabel className="text-black">Enrolled</FormLabel>
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
                  The number of students enrolled on this instrument. Note that
                  this number is not tied to the actual enrolments and can be
                  edited in case there are duplicate or accidental enrolments.
                </FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cap"
            render={({ field }) => (
              <FormItem className="w-full pb-6">
                <div className="flex items-baseline justify-between">
                  <FormLabel className="text-black">Cap</FormLabel>
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
                  The maximum number of students allowed to enrol on this
                  instrument for this school. Set to -1 for an infinite cap.
                </FormDescription>
              </FormItem>
            )}
          />
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
                    {["Available", "Unavailable", "Hidden"].map(
                      (item: string) => (
                        <SelectItem key={item} value={item} className="ml-3">
                          {item}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>

                <FormMessage />
                <FormDescription>
                  <span className="font-bold">Available:</span> Enrolments are
                  open unless the enrolment number has reached the cap.
                  <span className="font-bold">Unavailable:</span> Enrolments are
                  closed, but the instrument is still visible to users of the
                  website.
                  <span className="font-bold">Hidden:</span> The instrument is
                  not visible to users of the website.
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

export default EditInstrument;
