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
import { instrumentSchema, schoolSchema } from "@/lib/schema";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { createSchool } from "@/lib/server_actions/back_end/dbQueries_SCHOOL";
import { Checkbox } from "@/components/ui/checkbox";
import { createInstrument } from "@/lib/server_actions/back_end/dbQueries_INSTRUMENT";

const CreateInstrumentForm = () => {
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof instrumentSchema>>({
    resolver: zodResolver(instrumentSchema),
    defaultValues: {
      name: "",
      program_type: "Band",
      can_hire: true,
      hire_cost: 0,
      hire_insurance: 0,
    },
  });

  const { formState, handleSubmit, watch, setValue } = form;
  const { isSubmitting } = formState;
  const { can_hire } = watch();

  React.useEffect(() => {
    setValue("hire_cost", 0);
    setValue("hire_insurance", 0);
  }, [can_hire]);

  const onSubmit = async (formData: z.infer<typeof instrumentSchema>) => {
    const response = await createInstrument(formData);
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
              name="program_type"
              render={({ field }) => (
                <FormItem className="md:w-1/2 pb-6">
                  <div className="flex items-baseline justify-between">
                    <FormLabel>Program Type</FormLabel>
                  </div>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {["Band", "Keyboard", "String", "Guitar"].map(
                        (item: any) => (
                          <SelectItem key={item} value={item} className="ml-3">
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

            <FormLabel className="text-black">
              Is the instrument hireable?
            </FormLabel>
            <FormField
              control={form.control}
              name="can_hire"
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
                    Check this box if this instrument can be hired
                  </FormLabel>

                  <FormMessage />
                </FormItem>
              )}
            />

            {can_hire && (
              <>
                <FormField
                  control={form.control}
                  name="hire_cost"
                  render={({ field }) => (
                    <FormItem className="w-full pb-6">
                      <div className="flex items-baseline justify-between">
                        <FormLabel className="text-black">Hire Cost</FormLabel>
                      </div>
                      <FormControl>
                        <Input
                          className="max-w-[300px]"
                          type="number"
                          {...field}
                          onChange={(event) =>
                            field.onChange(+event.target.value)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                      <FormDescription>
                        The per month cost to hire the instrument
                      </FormDescription>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="hire_insurance"
                  render={({ field }) => (
                    <FormItem className="w-full pb-6">
                      <div className="flex items-baseline justify-between">
                        <FormLabel className="text-black">
                          Insurance Cost
                        </FormLabel>
                      </div>
                      <FormControl>
                        <Input
                          className="max-w-[300px]"
                          type="number"
                          {...field}
                          onChange={(event) =>
                            field.onChange(+event.target.value)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                      <FormDescription>
                        The per month cost to insure the instrument
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </>
            )}
          </CardContent>
          <CardFooter className="border-t px-6 py-4 flex flex-row gap-4 justify-between">
            <p className="italic">
              Click Create Instrument to connect it to Models and Accessories
            </p>

            <Button disabled={isSubmitting} type="submit">
              Create Instrument
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

const CreateInstrument = () => {
  return (
    <div className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
      <div className="mx-auto grid w-full max-w-6xl gap-2">
        <h1 className="text-3xl font-semibold">Create New Instrument</h1>
      </div>
      <div className="mx-auto w-full max-w-6xl items-start gap-6">
        <CreateInstrumentForm />
      </div>
    </div>
  );
};

export default CreateInstrument;
