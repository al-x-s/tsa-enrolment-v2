"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { gradeSchema } from "@/lib/schema";
import { createGrade } from "@/lib/server_actions/back_end/dbQueries_GRADE";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import z from "zod";

const CreateGradeForm = () => {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof gradeSchema>>({
    resolver: zodResolver(gradeSchema),
    defaultValues: {
      name: "",
      state_territory: "NSW",
      category: "Primary",
      order: 0,
    },
  });

  const { formState, handleSubmit } = form;
  const { isSubmitting } = formState;

  const onSubmit = async (formData: z.infer<typeof gradeSchema>) => {
    const response = await createGrade(formData);
    if (response.isSuccess) {
      router.push("/admin/grades");
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
              name="category"
              render={({ field }) => (
                <FormItem className="md:w-1/2 pb-6">
                  <div className="flex items-baseline justify-between">
                    <FormLabel>Category</FormLabel>
                  </div>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {["Pre", "Primary", "Secondary", "Tertiary"].map(
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
              name="order"
              render={({ field }) => (
                <FormItem className="w-full pb-6">
                  <div className="flex items-baseline justify-between">
                    <FormLabel className="text-black">Order</FormLabel>
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
                    This is the order that this grade will appear in relative to
                    other grades available at a school. If the grade is "Year 1"
                    set the order to "1", or for "Year 2" set it to "2". If the
                    grade is "Kindergarten", set to "0". Any Pre-School values
                    should be below 0, and similarly Tertiary values should in
                    most cases be above 12.
                  </FormDescription>
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="border-t px-6 py-4 flex flex-row justify-between">
            <p className="italic">Click to create grade</p>

            <Button disabled={isSubmitting} type="submit">
              Create Grade
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
        <h1 className="text-3xl font-semibold">Create New Grade</h1>
      </div>
      <div className="mx-auto w-full max-w-6xl items-start gap-6">
        <CreateGradeForm />
      </div>
    </div>
  );
};

export default CreateGrade;
