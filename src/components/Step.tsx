"use client";
import React from "react";
import clsx from "clsx";

// Components
import Link from "next/link";

const stepOrder: { [key: string]: number } = {
  welcome: 1,
  student_details: 2,
  tuition_type: 3,
  your_details: 4,
  instrument_options: 5,
  accessories: 6,
  summary: 7,
};

export default function Step({ step, segment }: StepProps) {
  // const { getValues } = useAppFormContext();

  const [isDisabled, setIsDisabled]: any = React.useState(true);
  // const previousPage: number = step.number - 1;

  React.useEffect(() => {
    const currentStep = stepOrder[segment];

    if (step.number <= currentStep) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [segment]);

  return (
    <Link
      href={`/${step.segment}`}
      className={isDisabled ? "pointer-events-none" : ""}
      aria-disabled={isDisabled}
      tabIndex={isDisabled ? -1 : undefined}
    >
      <div className="flex items-center gap-4">
        <button
          aria-disabled={isDisabled}
          tabIndex={-1}
          className={clsx(
            "w-[33px] h-[33px] rounded-full border",
            "transition-colors duration-300",
            isDisabled
              ? "bg-transparent text-theme-300 border-theme-300"
              : step.segment === segment
              ? "bg-theme-900 text-white border-theme-900"
              : " text-theme-900 border-theme-900",
            "font-bold text-sm"
          )}
        >
          {step.number}
        </button>
        <div className="hidden lg:flex flex-col uppercase">
          <h3
            className={clsx(
              "font-normal text-[13px]",
              isDisabled ? "text-theme-grey-light" : "text-cool-gray"
            )}
          >
            Step {step.number}
          </h3>
          <h2
            className={clsx(
              "font-bold text-[14px] tracking-[0.1em]",
              isDisabled ? "text-theme-grey-light" : "text-theme-grey"
            )}
          >
            {step.heading}
          </h2>
        </div>
      </div>
    </Link>
  );
}

interface StepProps {
  step: {
    number: number;
    segment:
      | "welcome"
      | "student_details"
      | "tuition_type"
      | "your_details"
      | "instrument_options"
      | "accessories"
      | "summary";
    heading: string;
  };
  segment:
    | "welcome"
    | "student_details"
    | "tuition_type"
    | "your_details"
    | "instrument_options"
    | "accessories"
    | "summary";
}
