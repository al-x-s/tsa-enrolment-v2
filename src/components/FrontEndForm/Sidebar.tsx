"use client";

import { useSelectedLayoutSegment } from "next/navigation";
// Components
import Image from "next/image";
import Step from "./Step";
// Images
// import logo from "images/tsa-logo.png";

export default function Sidebar() {
  const segment = useSelectedLayoutSegment() as
    | "welcome"
    | "student_details"
    | "tuition_type"
    | "your_details"
    | "instrument_options"
    | "accessories"
    | "summary";

  const steps: {
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
  }[] = [
    {
      number: 1,
      segment: "welcome",
      heading: "Welcome",
    },
    {
      number: 2,
      segment: "student_details",
      heading: "Student Details",
    },
    {
      number: 3,
      segment: "tuition_type",
      heading: "Tuition Type",
    },
    {
      number: 4,
      segment: "your_details",
      heading: "Your Details",
    },
    {
      number: 5,
      segment: "instrument_options",
      heading: "Instrument Options",
    },
    {
      number: 6,
      segment: "accessories",
      heading: "Accessories",
    },
    {
      number: 7,
      segment: "summary",
      heading: "Summary",
    },
  ];

  const Steps = steps.map((step) => (
    <Step key={step.number} step={step} segment={segment} />
  ));

  return (
    <div className="relative shrink-0">
      <div className="lg:inset-0 lg:px-8 py-8 lg:py-0 flex flex-row justify-center lg:justify-stretch lg:flex-col gap-4 lg:gap-6">
        <Image
          src={`/images/tsa-logo.png`}
          width={1353}
          height={1020}
          alt="TSA Logo"
          priority
          className="hidden lg:block -z-10 max-w-40"
        />
        {Steps}
      </div>
    </div>
  );
}
