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
import { schoolSchema } from "@/lib/schema";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { createSchool } from "@/lib/server_actions/back_end/dbQueries_SCHOOL";
import { Checkbox } from "@/components/ui/checkbox";

const CreateSchoolForm = () => {
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof schoolSchema>>({
    resolver: zodResolver(schoolSchema),
    defaultValues: {
      name: "",
      state_territory: "NSW",
      facility_hire: 0,
      resource_levy: 0,
      offers_instrument_rental: false,
    },
  });

  const { formState, handleSubmit } = form;
  const { isSubmitting } = formState;

  const onSubmit = async (formData: z.infer<typeof schoolSchema>) => {
    const response = await createSchool(formData);
    if (response.isSuccess) {
      router.push(response.redirect!);
    } else {
      toast({
        title: "Something went wrong...",
        description: response.issues as string,
      });
    }
  };

  return (
    <Card className="max-w-[500px]">
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="pt-4">
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
                  <FormMessage className="text-destructive" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="state_territory"
              render={({ field }) => (
                <FormItem className="md:w-1/2 pb-6">
                  <div className="flex items-baseline justify-between">
                    <FormLabel>State or Territory</FormLabel>
                  </div>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {[
                        "ACT",
                        "NSW",
                        "NT",
                        "QLD",
                        "SA",
                        "TAS",
                        "VIC",
                        "WA",
                      ].map((item: any) => (
                        <SelectItem key={item} value={item} className="ml-3">
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="facility_hire"
              render={({ field }) => (
                <FormItem className="w-full pb-6">
                  <div className="flex items-baseline justify-between">
                    <FormLabel className="text-black">Facility Hire</FormLabel>
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
                    The per term facility hire fee charged to parents. Set to 0
                    if none.
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="resource_levy"
              render={({ field }) => (
                <FormItem className="w-full pb-6">
                  <div className="flex items-baseline justify-between">
                    <FormLabel className="text-black">Resource Levy</FormLabel>
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
                    The per term resource levy charged to parents. Set to 0 if
                    none.
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormLabel className="text-black">
              Offers Instrument Rental
            </FormLabel>
            <FormField
              control={form.control}
              name="offers_instrument_rental"
              render={({ field }) => (
                <FormItem className="w-full pb-6 pt-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="border-black mr-1"
                    />
                  </FormControl>
                  <FormLabel className="">
                    Check this box if the school offers instrument rental
                  </FormLabel>

                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="border-t px-6 py-4 flex flex-row gap-4 justify-between">
            <p className="italic">
              Click Create School to connect it to Grades, Programs, and
              Instruments
            </p>

            <Button disabled={isSubmitting} type="submit">
              Create School
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

const CreateGrade = () => {
  return (
    <div className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
      <div className="mx-auto grid w-full max-w-6xl gap-2">
        <h1 className="text-3xl font-semibold">Create New School</h1>
      </div>
      <div className="mx-auto w-full max-w-6xl items-start gap-6">
        <CreateSchoolForm />
      </div>
    </div>
  );
};

export default CreateGrade;
