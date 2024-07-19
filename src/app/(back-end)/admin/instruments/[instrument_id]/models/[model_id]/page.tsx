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
import {
  deleteModel,
  getModel,
  updateModel,
} from "@/lib/server_actions/back_end/dbQueries_MODEL";
import { getInstrumentImages } from "@/lib/server_actions/back_end/dbQueries_INSTRUMENT";

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
import Loading from "@/components/DataTable/Loading";
import BrowseImages from "../BrowseImages";
import {
  BrandAndStatus,
  DetailsRow,
  ModelOptionWrapper,
  ModelPricing,
} from "@/components/ModelOption";

// Cloudinary Upload Widget
import { CldImage, CldUploadWidget } from "next-cloudinary";

function useUpdateModel() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateModel,
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({
        queryKey: ["getInstrumentModel", data.id],
      });
    },
    onError: (error: any) => {
      toast({
        title: "Something went wrong...",
        description: error.message,
      });
    },
  });
}

const ModelPage = ({ params }: any) => {
  const router = useRouter();
  const instrument_id = parseInt(decodeURI(params.instrument_id));
  const model_id = parseInt(decodeURI(params.model_id));
  const [formInitialized, setFormInitialized] = React.useState(false);

  // Fetch page data
  const { data: model_details } = useQuery({
    queryKey: ["getInstrumentModel", model_id],
    queryFn: async () => {
      const data = await getModel(model_id);
      return data;
    },
  });

  const {
    data: images,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["getInstrumentImages"],
    queryFn: async () => {
      const data = await getInstrumentImages();
      return data;
    },
    enabled: !!model_details,
  });

  const { toast } = useToast();

  const updateModel = useUpdateModel();

  const onSubmit = async (formData: z.infer<typeof modelSchema>) => {
    updateModel.mutate(
      { formData, id: model_id },
      {
        onSuccess: () => {
          toast({
            title: "Success!",
            description: `Model updated`,
          }),
            reset({
              model: formData.model,
              brand: formData.brand,
              image: formData.image,
              status: formData.status,
              rrp: formData.rrp,
              sale_price: formData.sale_price,
            });
        },
      }
    );
  };

  const form = useForm<z.infer<typeof modelSchema>>({
    resolver: zodResolver(modelSchema),
    defaultValues: {
      model: model_details?.model,
      brand: model_details?.brand,
      image: model_details?.image,
      status: model_details?.status,
      rrp: model_details?.rrp,
      sale_price: model_details?.sale_price,
    },
  });

  React.useEffect(() => {
    if (model_details && !formInitialized) {
      form.reset({
        model: model_details?.model,
        brand: model_details?.brand,
        image: model_details?.image,
        status: model_details?.status,
        rrp: model_details?.rrp,
        sale_price: model_details?.sale_price,
      });
      setFormInitialized(true);
    }
  }, [model_details, form, formInitialized]);

  const { formState, handleSubmit, reset, watch, setValue } = form;
  const { isDirty, isSubmitting } = formState;
  const { model, brand, image, status, rrp, sale_price } = watch();

  const handleDelete = async (model_id: number) => {
    const response = await deleteModel(model_id);
    if (response.isSuccess) {
      router.push(`/admin/instruments/${instrument_id}/models`);
    }
  };

  const isSoldOut = status === "Sold_Out" ? true : false;

  if (isPending || isError || !formInitialized) {
    return <Loading />;
  }

  return (
    <>
      <div className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
        <div className="mx-auto grid w-full max-w-7xl items-start gap-6 md:grid-cols-[1fr_300px] lg:grid-cols-[1fr_400px]">
          <Card className="mb-4">
            <Form {...form}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <CardHeader>
                  <CardTitle>
                    {model_details?.brand} {model_details?.model}
                  </CardTitle>
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
                          <FormLabel>Status</FormLabel>
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
                          <Input
                            className="max-w-[300px]"
                            {...field}
                            disabled
                          />
                        </FormControl>
                        <FormMessage />
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              type="button"
                              className="border grey 1px p-3 rounded shadow"
                            >
                              Browse Images
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <BrowseImages
                              images={images}
                              image_public_id={image}
                              setValue={setValue}
                            />
                          </DialogContent>
                        </Dialog>
                        <CldUploadWidget
                          options={{ sources: ["local", "url"] }}
                          signatureEndpoint={"/api/sign-image"}
                          onSuccess={(result: any, { widget }) => {
                            setValue("image", result?.info.public_id, {
                              shouldDirty: true,
                            });
                            widget.close();
                          }}
                          uploadPreset="instrument_option"
                        >
                          {({ open }) => {
                            return (
                              <Button
                                className={"border grey 1px p-3 rounded shadow"}
                                onClick={() => open()}
                                type="button"
                                variant="secondary"
                              >
                                Upload an Image
                              </Button>
                            );
                          }}
                        </CldUploadWidget>
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

          <div>
            <div className="px-4 py-2 bg-gradient-to-br from-theme-600 to-theme-900 max-w-[500px] mb-4 rounded">
              <div className="ml-2 py-6">
                <h1 className="text-2xl font-bold text-white">
                  What The User See's
                </h1>
              </div>
              <ModelOptionWrapper
                isSoldOut={isSoldOut}
                selectedPurchaseModel="demo"
                model={model}
              >
                <div className="flex flex-row justify-between">
                  <div className="w-[70%] flex flex-col justify-between ">
                    <BrandAndStatus
                      brand={brand}
                      isSoldOut={isSoldOut}
                      selectedPurchaseModel="demo"
                      model={model}
                    />
                    <div className="px-4">
                      <ModelPricing
                        isSoldOut={isSoldOut}
                        rrp={rrp}
                        sale_price={sale_price}
                      />

                      <DetailsRow label="Brand" value={brand} />
                      <DetailsRow label="Model" value={model} />
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
                    <CldImage
                      width="93"
                      height="300"
                      src={image}
                      alt={`Picture of instrument`}
                    />
                  </div>
                </div>
              </ModelOptionWrapper>
              {/* </article> */}
            </div>
            <Card className="mb-4 rounded">
              <CardHeader>
                <CardTitle>Delete Model</CardTitle>
              </CardHeader>
              <CardContent className="mb-6">
                Delete the model and any data associated with it
              </CardContent>
              <CardFooter className="border-t px-6 py-4 flex flex-row justify-between">
                <p className="italic">
                  WARNING: Deleting a model cannot be undone.
                </p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="rounded" variant="destructive">
                      Delete Model
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Confirm Deletion</DialogTitle>
                    </DialogHeader>
                    <p>Are you sure you want to delete {model}?</p>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="secondary">Cancel</Button>
                      </DialogClose>
                      <DialogClose asChild>
                        <Button
                          variant="default"
                          onClick={() => handleDelete(model_id)}
                        >
                          Yes
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModelPage;
