"use client";
import React from "react";
import { z } from "zod";
import useAppForm from "@/lib/hooks/useAppForm";
import { SubmitHandler, FormProvider } from "react-hook-form";
import { useRouter } from "next/navigation";
// Types
import { FormDataSchema } from "@/lib/schemas/schema";
import { UserSelectionsProvider } from "@/components/Providers/UserSelectionsProvider";
type FormValues = z.infer<typeof FormDataSchema>;
// Components
import Sidebar from "@/components/FrontEndForm/Sidebar";
import { Form } from "@/components/ui/form";
// Default Values
import { formDefaultValues } from "@/lib/config/formDefaultValues";
// React Query Provider
import ReactQueryProvider from "@/components/Providers/ReactQueryProviders";

export default function FrontEndProvider({ children }: FormProviderProps) {
  const route = useRouter();

  const methods = useAppForm(formDefaultValues);

  const onSubmit = async (data: z.infer<typeof FormDataSchema>) => {
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
    // console.log("Errors", error);
  };

  const formRef = React.useRef<HTMLFormElement>(null);

  return (
    <ReactQueryProvider>
      <FormProvider {...methods}>
        <UserSelectionsProvider>
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
        </UserSelectionsProvider>
      </FormProvider>
    </ReactQueryProvider>
  );
}

interface FormProviderProps {
  children: React.ReactNode;
}
