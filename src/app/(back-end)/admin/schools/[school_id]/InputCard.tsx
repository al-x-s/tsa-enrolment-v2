"use client";
import React from "react";
import z, { isDirty } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { getSchoolById, update } from "../getSchoolById";
import { useQuery } from "@tanstack/react-query";
import { formSchema } from "./schema";
import { SchoolData } from "@/lib/types";
import { useToast } from "@/components/ui/use-toast";

const InputCard = ({ ...props }) => {
  const { data, error, isFetched } = useQuery({
    queryKey: ["school", props.school_id],
    queryFn: async () => {
      const data = await getSchoolById(props.school_id);
      return data;
    },
  });

  const fieldName = props.fieldName as keyof SchoolData;
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
        description: `${props.title} successfully updated`,
      });
      reset({ [fieldName]: formData[fieldName] });
    } else {
      toast({
        title: "Something went wrong...",
        description: response.issues,
      });
    }
  };

  return (
    <Card id={props.fieldName} className="mb-4">
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>{props.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name={props.fieldName}
              render={({ field }) => (
                <FormItem className="w-full pb-6">
                  {/* <div className="flex items-baseline justify-between">
                          <FormLabel className="text-black">{props.title}</FormLabel>
                        </div> */}
                  <FormControl>
                    <>
                      {props.inputType === "text" && (
                        <Input
                          className="max-w-[300px]"
                          type={props.inputType}
                          {...field}
                        />
                      )}
                      {props.inputType === "number" && (
                        <Input
                          className="max-w-[300px]"
                          type={props.inputType}
                          {...field}
                          onChange={(event) =>
                            field.onChange(+event.target.value)
                          }
                        />
                      )}
                      {props.inputType === "checkbox" && (
                        <>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="border-black mr-1"
                          />
                          <FormLabel className="">{props.label}</FormLabel>
                        </>
                      )}
                      {/* {props.inputType === "radio" && (
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value.toString()}
                          className="flex flex-col space-y-1 fill-black"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem
                                value={`${true}`}
                                className=" text-black"
                              />
                            </FormControl>
                            <FormLabel className="">Yes</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem
                                value={`${false}`}
                                className=" text-black"
                              />
                            </FormControl>
                            <FormLabel className="">No</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      )} */}
                    </>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="border-t px-6 py-4 flex flex-row justify-between">
            <p className="italic">{props.description}</p>
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

export default InputCard;
