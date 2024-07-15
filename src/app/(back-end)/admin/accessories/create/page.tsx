"use client";
import React from "react";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
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
import { useQuery } from "@tanstack/react-query";
import Loading from "@/components/tables/Loading";
import { accessorySchema, programSchema } from "@/lib/schema";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";
import { useRouter } from "next/navigation";

// Tanstack
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createAccessory,
  deleteAccessory,
  getAccessory,
  updateAccessory,
} from "@/lib/server_actions/back_end/dbQueries_ACCESSORY";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";

const AccessoryPage = () => {
  const router = useRouter();

  const { toast } = useToast();

  const onSubmit = async (formData: z.infer<typeof accessorySchema>) => {
    const response = await createAccessory(formData);
    if (response.isSuccess) {
      router.push("/admin/accessories");
    } else {
      toast({
        title: "Something went wrong...",
        description: response.issues as string,
      });
    }
  };

  const form = useForm<z.infer<typeof accessorySchema>>({
    resolver: zodResolver(accessorySchema),
    defaultValues: {
      name: "",
      status: "Active",
      price: 0,
      is_recommended: true,
      description_short: "",
      description_long: "",
    },
  });

  const { formState, handleSubmit, reset, watch, setValue } = form;
  const { isDirty, isSubmitting } = formState;
  const {
    name,
    status,
    price,
    is_recommended,
    description_short,
    description_long,
  } = watch();
  return (
    <>
      <Card className="mb-4">
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle>Accessory Details</CardTitle>
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
                name="status"
                render={({ field }) => (
                  <FormItem className="md:w-1/2 pb-6">
                    <div className="flex items-baseline justify-between">
                      <FormLabel>Status</FormLabel>
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

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem className="w-full pb-6">
                    <div className="flex items-baseline justify-between">
                      <FormLabel className="text-black">Price</FormLabel>
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
              <FormField
                control={form.control}
                name="is_recommended"
                render={({ field }) => (
                  <FormItem className="w-full pb-6">
                    <div className="flex items-baseline justify-between pb-2">
                      <FormLabel className="text-black">Recommended</FormLabel>
                    </div>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="border-black mr-1"
                      />
                    </FormControl>
                    <FormLabel className="">
                      Select if this is a recommended accessory
                    </FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description_short"
                render={({ field }) => (
                  <FormItem className="w-full pb-6">
                    <div className="flex items-baseline justify-between">
                      <FormLabel className="text-black">
                        Short Description
                      </FormLabel>
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
                name="description_long"
                render={({ field }) => (
                  <FormItem className="w-full pb-6">
                    <div className="flex items-baseline justify-between">
                      <FormLabel className="text-black">
                        Long Description
                      </FormLabel>
                    </div>
                    <FormControl>
                      <Textarea {...field} maxLength={1000} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="border-t px-6 py-4 flex flex-row justify-between">
              <p className="italic">Click to create accessory</p>
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

      <div className="rounded px-4 pb-4 bg-gradient-to-br from-theme-600 to-theme-900 max-w-[500px]">
        <div className="ml-2 py-6">
          <h1 className="text-2xl font-bold text-white">What The User See's</h1>
        </div>
        <div className="max-w-[400px]">
          {is_recommended && (
            <div className="relative inline-flex w-[100%]">
              <div
                className={clsx(
                  "absolute inset-x-0 mx-auto w-fit h-fit -translate-y-[20%] rounded-sm bg-[#979797]"
                )}
              >
                <p className={clsx("text-white px-2 py-1")}>RECOMMENDED</p>
              </div>
            </div>
          )}
          <article
            className={clsx(
              "flex flex-row justify-between border-4 rounded-lg p-2 mb-4 h-fit bg-[#E6D3F9] border-[#979797] "
            )}
          >
            <div
              className={clsx("flex flex-col", is_recommended ? "pt-4" : "")}
            >
              <div className="flex space-between">
                <h2 className="text-xl font-bold my-1 font-ubuntu">
                  {name} - ${price}
                </h2>
              </div>
              <p className="font-light pb-2">{description_short}</p>
            </div>
            <div className="self-center pl-4">
              <Switch aria-readonly />
            </div>
          </article>
          <Card>
            <CardHeader>
              <CardTitle>Long Description</CardTitle>
              <CardDescription>
                (Shown if user requests more info on accessory)
              </CardDescription>
            </CardHeader>
            <CardContent className="sm:max-w-md">
              <p className="leading-8 mb-4 text-theme-grey">
                {description_long}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default AccessoryPage;
