"use client";
import React from "react";
import { z } from "zod";
import useAppForm from "@/lib/hooks/useAppForm";
import { SubmitHandler, FormProvider } from "react-hook-form";
import { useRouter } from "next/navigation";
// Types
import { FormDataSchema } from "@/lib/schema";
type FormValues = z.infer<typeof FormDataSchema>;
// Components
import Sidebar from "@/components/Sidebar";
import { Form } from "@/components/ui/form";
// Default Values
import { formDefaultValues } from "@/lib/formDefaultValues";

export default function Provider({ children }: FormProviderProps) {
  const route = useRouter();

  const methods = useAppForm(formDefaultValues);

  const onSubmit = async (data: z.infer<typeof FormDataSchema>) => {
    console.log(data);
    fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success === true) {
          route.push("thankyou");
        }
      });
  };

  const index: { [key: string]: string } = {
    student_first_name: "student_details",
    client_email: "your_details",
  };

  const onError = (error: any) => {
    console.log("Errors", error);
  };

  const formRef = React.useRef<HTMLFormElement>(null);

  return (
    <FormProvider {...methods}>
      <Sidebar />
      <Form {...methods}>
        <form
          ref={formRef}
          onSubmit={methods.handleSubmit(onSubmit, onError)}
          className="flex flex-col w-full h-full"
        >
          {children}
        </form>
      </Form>
    </FormProvider>
  );
}

interface FormProviderProps {
  children: React.ReactNode;
}
