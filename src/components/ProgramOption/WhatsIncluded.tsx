import Image from "next/image";
import React from "react";

const TickItem = ({ text }: { text: string }) => (
  <div className="flex flex-row items-center mt-2">
    <Image
      alt="tick inside a circle"
      src={`images/circle-tick.svg`}
      height={16}
      width={16}
    />
    <p className="ml-2">{text}</p>
  </div>
);

const WhatsIncluded = ({
  classType,
  type,
}: {
  classType: string;
  type: string;
}) => (
  <>
    {classType !== "Rehearsal" && (
      <TickItem text={`One ${classType} lesson per week`} />
    )}
    {(type === "Band" || type === "String") && (
      <TickItem text="One Rehearsal per week" />
    )}
    <TickItem text="Access to the Online Resource Library" />
  </>
);

export default WhatsIncluded;
