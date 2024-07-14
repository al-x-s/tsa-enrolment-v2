"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Zod
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// React Hook Form
import { useForm } from "react-hook-form";

// React Query
import { useQuery } from "@tanstack/react-query";

// Tanstack Table
import { useMutation, useQueryClient } from "@tanstack/react-query";

// DB Queries
import { deleteModel } from "@/lib/server_actions/back_end/dbQueries_INSTRUMENT";
import {
  getInstrumentModel,
  updateInstrumentModel,
} from "@/lib/server_actions/back_end/dbQueries_INSTRUMENT";

//Schemas
import { modelSchema } from "@/lib/schema";

// Styling
import clsx from "clsx";

// Images
import circleTick from "@/images/circle-tick.svg";

// Components
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
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
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const ModelPage = ({ params }: any) => {
  const router = useRouter();
  const instrument_id = parseInt(decodeURI(params.instrument_id));

  const onSubmit = async (formData: z.infer<typeof modelSchema>) => {};

  const form = useForm<z.infer<typeof modelSchema>>({
    resolver: zodResolver(modelSchema),
    defaultValues: {
      model: "",
      brand: "",
      image: "",
      status: "Available",
      rrp: 0,
      sale_price: 0,
    },
  });

  const { formState, handleSubmit, reset, watch, setValue } = form;
  const { isDirty, isSubmitting } = formState;
  const { model, brand, image, status, rrp, sale_price } = watch();

  const isSoldOut = status === "Sold_Out" ? true : false;

  return (
    <>
      <div className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
        <div className="mx-auto grid w-full max-w-7xl items-start gap-6 md:grid-cols-[1fr_300px] lg:grid-cols-[1fr_400px]">
          <Card className="mb-4">
            <Form {...form}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <CardHeader>
                  <CardTitle>Create Model</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="model"
                    render={({ field }) => (
                      <FormItem className="w-full pb-6">
                        <div className="flex items-baseline justify-between">
                          <FormLabel className="text-black">Model</FormLabel>
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
                    name="brand"
                    render={({ field }) => (
                      <FormItem className="w-full pb-6">
                        <div className="flex items-baseline justify-between">
                          <FormLabel className="text-black">Brand</FormLabel>
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
                          <FormLabel>Program Type</FormLabel>
                        </div>
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
                            {["Available", "Sold_Out"].map((item: any) => (
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sale_price"
                    render={({ field }) => (
                      <FormItem className="w-full pb-6">
                        <div className="flex items-baseline justify-between">
                          <FormLabel className="text-black">
                            Sale Price
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

                  <FormField
                    control={form.control}
                    name="rrp"
                    render={({ field }) => (
                      <FormItem className="w-full pb-6">
                        <div className="flex items-baseline justify-between">
                          <FormLabel className="text-black">RRP</FormLabel>
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
                    name="image"
                    render={({ field }) => (
                      <FormItem className="w-full pb-6">
                        <div className="flex items-baseline justify-between">
                          <FormLabel className="text-black">Image</FormLabel>
                        </div>
                        <FormControl>
                          <Input className="max-w-[300px]" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter className="border-t px-6 py-4 flex flex-row justify-between">
                  <p className="italic">Click to save changes</p>
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

          <div className="px-4 bg-gradient-to-br from-theme-600 to-theme-900 max-w-[500px]">
            <div className="ml-2 py-6">
              <h1 className="text-2xl font-bold text-white">
                What The User See's
              </h1>
            </div>
            <article
              className={clsx(
                "border-4 rounded-lg mb-4 h-fit max-w-[400px] border-[#979797]",
                isSoldOut ? "bg-[#B0AFAF]" : "bg-[#E6D3F9]"
              )}
            >
              <div className="flex flex-row justify-between">
                <div className="w-[70%] flex flex-col justify-between ">
                  <div
                    className={clsx(
                      "rounded-ee-lg w-fit py-2 px-4 font-semibold text-center bg-[#9689A4]",
                      isSoldOut ? "text-[#161616]" : "text-white"
                    )}
                  >
                    {brand} {isSoldOut ? " - Sold Out" : ""}
                  </div>
                  <div className="px-4">
                    <div className="flex flex-row items-center mt-4 font-bold">
                      <h2
                        className={clsx(
                          "text-2xl my-1 font-ubuntu",
                          !isSoldOut ? "text-[#f1933e] font-extrabold" : ""
                        )}
                      >
                        {isSoldOut ? `$${rrp}` : `On Sale $${sale_price}`}
                      </h2>
                    </div>
                    {!isSoldOut && (
                      <p className="pb-1 font-light">
                        RRP $<span className="line-through">{`${rrp}`}</span>
                      </p>
                    )}

                    <div className="flex flex-row items-center mt-2">
                      <Image alt="tick inside a circle" src={circleTick} />
                      <p className="ml-2">Brand: {brand}</p>
                    </div>
                    <div className="flex flex-row items-center mt-2">
                      <Image alt="tick inside a circle" src={circleTick} />
                      <p className="ml-2">Model: {model}</p>
                    </div>
                  </div>
                  <div className="flex justify-end pr-2">
                    <div
                      className={clsx(
                        "px-6 py-2 my-4 rounded",
                        isSoldOut
                          ? "bg-[#979797] text-[#161616]"
                          : "text-white bg-gradient-to-br from-theme-600 to bg-theme-900"
                      )}
                    >
                      {isSoldOut ? "Unavailable" : `Select ${brand}`}
                    </div>
                  </div>
                </div>

                <div className="w-[30%] py-2">
                  <Image
                    src={image}
                    alt={`Picture of ${brand} ${model}`}
                    width={93}
                    height={300}
                    style={{ objectFit: "contain" }}
                  />
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModelPage;
