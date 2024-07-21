import React from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { GeneralTermsDialogContent } from "./generalTerms";

export function WelcomeMessage({ ...props }) {
  return (
    <div>
      <p className="text-white pb-4 leading-8">
        Welcome to the online enrolment platform for Teaching Services
        Australia. We work closely with{" "}
        <span className="font-semibold">{props.student_school}</span> to provide
        an inclusive and engaging instrumental tuition program.
      </p>
      <p className="text-white pb-4 leading-8">
        Before you continue please read and agree to the{" "}
        <Dialog>
          <DialogTrigger asChild>
            <Link href="" className="text-[#F6BD60] underline">
              terms and conditions
            </Link>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] md:max-h-[70vh] max-w-[90vw] md:max-w-lg rounded">
            <DialogHeader>
              <DialogTitle className="mb-2 text-xl text-center">
                TSA Terms and Conditions
              </DialogTitle>
            </DialogHeader>
            <GeneralTermsDialogContent />

            <DialogFooter>
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="unstyled"
                  className="px-6 py-2 text-white bg-gradient-to-br from-theme-600 to bg-theme-900 rounded my-2 shadow hover:text-theme-grey-light"
                >
                  Close
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        .
      </p>
      <FormField
        control={props.control}
        name="agree_tsa_terms"
        render={({ field }) => (
          <FormItem className="flex flex-col items-start rounded-md border p-4 mb-6">
            <div className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  ref={(node) => {
                    if (props.errors?.agree_tsa_terms && node) {
                      node.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                      });
                    }
                  }}
                />
              </FormControl>
              <div className="leading-none">
                <FormLabel className="text-white font-semibold">
                  I agree to the terms and conditions
                </FormLabel>
              </div>
            </div>

            <FormMessage className="ml-6" />
          </FormItem>
        )}
      />

      <p className="text-white pb-4 leading-8">
        If you'd like more information before proceeding please visit our
        website{" "}
        <Link
          href="www.teachingservices.com.au"
          className="text-[#F6BD60] underline"
        >
          www.teachingservices.com.au
        </Link>{" "}
        , or contact us by phone or email:
      </p>
      <p className="text-white pb-4 leading-4">
        <span className="font-bold">Phone</span>:{" "}
        <Link href="tel:(02)96517333" className="text-[#F6BD60] underline">
          (02) 9651 7333
        </Link>{" "}
      </p>
      <p className="text-white pb-4 leading-4">
        <span className="font-bold">Email</span>:{" "}
        <Link
          href="mailto:enrolments@teachingservices.com.au"
          className="text-[#F6BD60] underline"
        >
          enrolments@teachingservices.com.au
        </Link>{" "}
      </p>
    </div>
  );
}

export default WelcomeMessage;
