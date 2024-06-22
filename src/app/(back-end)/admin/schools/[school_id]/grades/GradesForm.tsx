"use client";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getSchoolById, update } from "../../getSchoolById";
import { formSchema } from "../schema";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
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
import { Checkbox } from "@/components/ui/checkbox";

const GradesForm = ({ ...props }) => {
  const { data, error, isFetched } = useQuery({
    queryKey: ["school", props.school_id],
    queryFn: async () => {
      const data = await getSchoolById(props.school_id);
      return data;
    },
  });

  const fieldName = "grades";
  const value: any = data?.[fieldName];
  const defaultValue: any = { [fieldName]: value };

  const schema = formSchema.pick({ [fieldName]: true });
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: defaultValue,
  });

  const { formState, handleSubmit, reset } = form;
  const { isDirty, isSubmitting } = formState;

  const { toast } = useToast();

  const onSubmit = async (formData: z.infer<typeof schema>) => {
    const response = await update(formData, props.school_id);
    if (response.isSuccess) {
      console.log("success!");
      toast({
        title: "Success!",
        description: `Grades successfully updated`,
      });
      reset({ grades: formData.grades });
    } else {
      toast({
        title: "Something went wrong...",
        description: response.issues,
      });
    }
  };

  type GradeName =
    | "grades.K"
    | "grades.1"
    | "grades.2"
    | "grades.3"
    | "grades.4"
    | "grades.5"
    | "grades.6"
    | "grades.7"
    | "grades.8"
    | "grades.9"
    | "grades.10"
    | "grades.11"
    | "grades.12";

  const gradeMap: Array<{
    id: number | string;
    name: GradeName;
    label: string;
  }> = [
    { id: "K", name: "grades.K", label: "Kindergarten" },
    { id: 1, name: "grades.1", label: "Year 1" },
    { id: 2, name: "grades.2", label: "Year 2" },
    { id: 3, name: "grades.3", label: "Year 3" },
    { id: 4, name: "grades.4", label: "Year 4" },
    { id: 5, name: "grades.5", label: "Year 5" },
    { id: 6, name: "grades.6", label: "Year 6" },
    { id: 7, name: "grades.7", label: "Year 7" },
    { id: 8, name: "grades.8", label: "Year 8" },
    { id: 9, name: "grades.9", label: "Year 9" },
    { id: 10, name: "grades.10", label: "Year 10" },
    { id: 11, name: "grades.11", label: "Year 11" },
    { id: 12, name: "grades.12", label: "Year 12" },
  ];

  return (
    <Card id="grades" className="mb-4">
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>Grades</CardTitle>
          </CardHeader>
          <CardContent>
            {gradeMap.map(({ id, name, label }) => (
              <FormField
                key={id}
                control={form.control}
                name={name}
                render={({ field }) => {
                  return (
                    <FormItem
                      key={id}
                      className="flex flex-row items-start space-x-3 space-y-2"
                    >
                      <div className="flex flex-row items-start space-x-3 px-4 py-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="border-black"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="font-normal">{label}</FormLabel>
                        </div>
                      </div>
                    </FormItem>
                  );
                }}
              />
            ))}
            {/* <FormField
              control={form.control}
              name="grades"
              render={({ field }) => (
                <FormItem className="w-full pb-6">
                  <FormControl></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
          </CardContent>
          <CardFooter className="border-t px-6 py-4 flex flex-row justify-between">
            <p className="italic">
              Select the grades which TSA accepts enrolments at this school
            </p>
            <div>
              {isDirty && (
                <Button variant="secondary" onClick={() => reset()}>
                  Cancel
                </Button>
              )}
              <Button disabled={!isDirty || isSubmitting} type="submit">
                Save
              </Button>
            </div>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default GradesForm;
