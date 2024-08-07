import React from "react";
import clsx from "clsx";

const BrandAndStatus = ({
  brand,
  isSoldOut,
  selectedModel,
  model,
}: {
  brand: string;
  isSoldOut: boolean;
  selectedModel: string;
  model: string;
}) => (
  <div
    className={clsx(
      "rounded-ee-lg w-fit py-2 px-4 font-semibold text-center",
      isSoldOut ? "text-[#161616]" : "text-white",
      selectedModel === model ? "bg-[#F3A644] text-[#FEF9EE]" : "bg-[#9689A4]"
    )}
  >
    {brand} {isSoldOut ? " - Sold Out" : ""}
  </div>
);

export default BrandAndStatus;
