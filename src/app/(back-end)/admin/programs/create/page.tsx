"use client";
import React from "react";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import circleTick from "@/images/circle-tick.svg";
import clsx from "clsx";
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
import { Label } from "@/components/ui/label";
import {
  ProgramOptionWrapper,
  ClassTypeAndStatus,
  ProgramOptionTitle,
  ProgramOptionDescription,
  WhatsIncluded,
  ProgramOptionDialogTable,
} from "@/components/ProgramOption";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  createProgram,
  deleteProgram,
  getProgram,
  updateProgram,
} from "@/lib/server_actions/back_end/dbQueries_PROGRAM";

import { programSchema } from "@/lib/schema";
import { Button } from "@/components/ui/button";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

const CreateProgramPage = () => {
  const router = useRouter();
  const { toast } = useToast();

  const onSubmit = async (formData: z.infer<typeof programSchema>) => {
    const response = await createProgram(formData);
    if (response.isSuccess) {
      router.push(response.redirect!);
    } else {
      toast({
        title: "Something went wrong...",
        description: response.issues as string,
      });
    }
  };

  const form = useForm<z.infer<typeof programSchema>>({
    resolver: zodResolver(programSchema),
    defaultValues: {
      name: "",
      description: "",
      type: "Band",
      classType: "Group",
      tuition_fee: 0,
      rehearsal_fee: 0,
      enrol_fee: 0,
      program_status: "Active",
    },
  });

  const { formState, handleSubmit, reset, watch, setValue } = form;
  const { isDirty, isSubmitting } = formState;
  const {
    type,
    name,
    classType,
    tuition_fee,
    rehearsal_fee,
    program_status,
    description,
  } = watch();

  React.useEffect(() => {
    if (type === "Guitar" || type === "Keyboard") {
      setValue("rehearsal_fee", 0);
      setValue("classType", "Group");
    }
  }, [type]);

  React.useEffect(() => {
    if (classType === "Rehearsal") {
      setValue("tuition_fee", 0);
    }
  }, [classType]);

  return (
    <>
      <Card className="mb-4">
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle>Program Details</CardTitle>
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
                name="description"
                render={({ field }) => (
                  <FormItem className="w-full pb-6">
                    <div className="flex items-baseline justify-between">
                      <FormLabel className="text-black">Description</FormLabel>
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
                name="type"
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
                            <SelectItem
                              key={item}
                              value={item}
                              className="ml-3"
                            >
                              {`${item} Program`}
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
                name="classType"
                render={({ field }) => (
                  <FormItem className="md:w-1/2 pb-6">
                    <div className="flex items-baseline justify-between">
                      <FormLabel>Class Type</FormLabel>
                    </div>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {["Group", "Private"].map((item: any) => (
                          <SelectItem key={item} value={item} className="ml-3">
                            {item}
                          </SelectItem>
                        ))}
                        {(type === "Band" || type === "String") && (
                          <SelectItem value={"Rehearsal"} className="ml-3">
                            Rehearsal Only
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="md:flex md:flex-row md:gap-4">
                {classType !== "Rehearsal" && (
                  <FormField
                    control={form.control}
                    name="tuition_fee"
                    render={({ field }) => (
                      <FormItem className="w-full pb-6">
                        <div className="flex items-baseline justify-between">
                          <FormLabel className="text-black">
                            Tuition Fee
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
                      </FormItem>
                    )}
                  />
                )}
                {(type === "Band" || type === "String") && (
                  <FormField
                    control={form.control}
                    name="rehearsal_fee"
                    render={({ field }) => (
                      <FormItem className="w-full pb-6">
                        <div className="flex items-baseline justify-between">
                          <FormLabel className="text-black">
                            Rehearsal Fee
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
                      </FormItem>
                    )}
                  />
                )}
              </div>
              <FormField
                control={form.control}
                name="enrol_fee"
                render={({ field }) => (
                  <FormItem className="w-full pb-6">
                    <div className="flex items-baseline justify-between">
                      <FormLabel className="text-black">
                        Enrolment Fee
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
                      Note: The enrolment fee is shown on the Summary page
                    </FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="program_status"
                render={({ field }) => (
                  <FormItem className="md:w-1/2 pb-6">
                    <div className="flex items-baseline justify-between">
                      <FormLabel>Program Status</FormLabel>
                    </div>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {["Active", "Inactive"].map((item: any) => (
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
            </CardContent>
            <CardFooter className="border-t px-6 py-4 flex flex-row justify-between">
              <p className="italic">Click to create program</p>
              <div>
                {isDirty && (
                  <Button variant="secondary" onClick={() => reset()}>
                    Reset Form
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

      <div className="px-4 bg-gradient-to-br from-theme-600 to-theme-900 max-w-[500px]">
        <div className="ml-2 py-6">
          <h1 className="text-2xl font-bold text-white">What The User See's</h1>
        </div>
        <ProgramOptionWrapper
          isSelected={false}
          program_status={program_status}
        >
          <ClassTypeAndStatus
            program_status={program_status}
            isSelected={false}
            classType={classType}
          />
          <div className="px-4">
            <div className="flex flex-row items-center mt-4 font-bold">
              <ProgramOptionTitle
                tuition_fee={tuition_fee}
                levyFee={10}
                rehearsal_fee={rehearsal_fee}
              />
            </div>
            <ProgramOptionDescription description={description} />
            <WhatsIncluded classType={classType} type={type} />
          </div>
          <div className="flex justify-center">
            <Button
              className={clsx(
                "px-6 py-2 my-4 rounded",
                program_status === "Inactive"
                  ? "bg-[#979797] text-[#161616]"
                  : "text-white bg-gradient-to-br from-theme-600 to bg-theme-900"
              )}
              type="button"
              disabled={program_status === "Inactive" ? true : false}
            >
              {program_status === "Inactive"
                ? "Unavailable"
                : `Select ${classType}`}
            </Button>
          </div>
        </ProgramOptionWrapper>
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>{classType} Tuition</CardTitle>
            <CardDescription>Price breakdown.</CardDescription>
          </CardHeader>
          <CardContent>
            <ProgramOptionDialogTable
              levyFee={10}
              type={type}
              tuition_fee={tuition_fee}
              rehearsal_fee={rehearsal_fee}
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default CreateProgramPage;
