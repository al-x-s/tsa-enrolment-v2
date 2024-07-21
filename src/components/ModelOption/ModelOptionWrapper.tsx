import React from "react";
import clsx from "clsx";

const ModelOptionWrapper = ({
  isSoldOut,
  model,
  selectedModel,
  children,
}: {
  isSoldOut: boolean;
  model: string;
  selectedModel: string;
  children: React.ReactNode;
}) => (
  <article
    className={clsx(
      "border-4 rounded-lg mb-4 h-fit max-w-[400px]",
      isSoldOut ? "bg-[#B0AFAF]" : "bg-[#E6D3F9]",
      selectedModel === model ? "border-[#F6BD60]" : "border-[#979797]"
    )}
  >
    {children}
  </article>
);

export default ModelOptionWrapper;
