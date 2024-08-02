"use client";
import React from "react";
import { useRouter } from "next/navigation";
// Hooks
import useAppFormContext from "@/lib/hooks/useAppFormContext";
// Components
import Image from "next/image";
// Icons
// import thankYouIcon from "images/checked.png";

export default function ThankYouPage() {
  const router = useRouter();
  const { watch, formState } = useAppFormContext();

  const { student_school } = watch();

  React.useEffect(() => {
    if (!student_school) {
      router.replace("/welcome");
      return;
    }
  }, []);

  return (
    <section className="flex flex-col justify-center bg-gradient-to-br from-theme-600 to-theme-900 items-center px-6 lg:px-[100px] py-20 lg:pt-12 w-full h-full rounded-lg shadow-lg">
      {/* <section className="flex flex-col px-6 lg:px-[100px] pt-7 lg:pt-12 pb-8 lg:pb-4 w-full h-full bg-white lg:bg-transparent rounded-lg lg:rounded-none shadow-lg lg:shadow-none"> */}
      <Image
        src={`/images/checked.png`}
        width={512}
        height={512}
        alt=""
        className="w-[60px] lg:w-auto"
      />
      <h1 className="text-2xl lg:text-[32px] font-bold text-white mt-6">
        Success!
      </h1>
      <p className="text-cool-gray text-center mt-2 text-white">
        Your enrolment is being processed and we'll send you an email shortly
        confirming your selections and outlining what happens next.
      </p>
    </section>
  );
}
