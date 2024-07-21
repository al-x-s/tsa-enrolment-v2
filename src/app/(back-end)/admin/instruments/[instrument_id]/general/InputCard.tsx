"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
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
import { instrumentSchema } from "@/lib/schemas/schema";
import { updateInstrument } from "@/lib/server_actions/back_end/dbQueries_INSTRUMENT";
import { zodResolver } from "@hookform/resolvers/zod";
import { Instrument } from "@prisma/client";
import { useMutation, QueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import z from "zod";

function useUpdateInstrument() {
  const { toast } = useToast();
  const queryClient = new QueryClient();
  return useMutation({
    mutationFn: updateInstrument,
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({
        queryKey: ["school", data.id],
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

const InputCard = ({ ...props }) => {
  const fieldName = props.fieldName as keyof Pick<
    Instrument,
    "program_type" | "name" | "hire_cost" | "hire_insurance" | "can_hire"
  >;
  const value: any = props.data?.[fieldName];
  const defaultValue: any = { [fieldName]: value };

  const schema = instrumentSchema.pick({ [fieldName]: true });
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: defaultValue,
  });

  const { formState, handleSubmit, reset } = form;
  const { isDirty, isSubmitting } = formState;

  const { toast } = useToast();

  const updateInstrument = useUpdateInstrument();

  const onSubmit = async (formData: z.infer<typeof schema>) => {
    updateInstrument.mutate(
      { formData, id: props.id },
      {
        onSuccess: () => {
          toast({
            title: "Success!",
            description: `${props.title} updated`,
          }),
            reset({ [fieldName]: formData[fieldName] });
        },
      }
    );
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
