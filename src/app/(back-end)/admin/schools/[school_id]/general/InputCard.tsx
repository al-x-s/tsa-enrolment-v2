"use client";
import React from "react";
import z from "zod";
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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { updateSchool } from "@/lib/server_actions/back_end/dbQueries_SCHOOL";
import { formSchema } from "./schema";
import { School } from "@prisma/client";
import { useToast } from "@/components/ui/use-toast";

const InputCard = ({ ...props }) => {
  const fieldName = props.fieldName as keyof Pick<
    School,
    "facility_hire" | "name" | "offers_instrument_rental" | "resource_levy"
  >;
  const value: any = props.data?.[fieldName];
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
    const response = await updateSchool(formData, props.school_id);
    if (response.isSuccess) {
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
                  <>
                    {props.inputType === "text" && (
                      <FormControl>
                        <Input
                          className="max-w-[300px]"
                          type={props.inputType}
                          {...field}
                        />
                      </FormControl>
                    )}
                    {props.inputType === "number" && (
                      <FormControl>
                        <Input
                          className="max-w-[300px]"
                          type={props.inputType}
                          {...field}
                          onChange={(event) =>
                            field.onChange(+event.target.value)
                          }
                        />
                      </FormControl>
                    )}
                    {props.inputType === "checkbox" && (
                      <>
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="border-black mr-1"
                          />
                        </FormControl>
                        <FormLabel className="">{props.label}</FormLabel>
                      </>
                    )}
                    {props.inputType === "select" && (
                      <>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {props.options.map((item: any) => (
                              <SelectItem
                                key={item}
                                value={item}
                                className="ml-3"
                              >
                                {item}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </>
                    )}
                  </>

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
