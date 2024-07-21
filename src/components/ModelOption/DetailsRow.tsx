import React from "react";
import Image from "next/image";
// import circleTick from "images/circle-tick.svg";

const DetailsRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-row items-center mt-2">
    <Image
      alt="tick inside a circle"
      height={16}
      width={16}
      src={`/images/circle-tick.svg`}
    />
    <p className="ml-2">
      {label}: {value}
    </p>
  </div>
);

export default DetailsRow;
