import React from "react";
import clsx from "clsx";

const AccessoryOptionWrapper = ({
  isSelected,
  children,
}: {
  isSelected: boolean;
  children: React.ReactNode;
}) => (
  <article
    className={clsx(
      "flex flex-row justify-between border-4 rounded-lg p-2 mb-4 h-fit bg-[#E6D3F9] ",
      isSelected ? "border-[#F6BD60]" : "border-[#979797]"
    )}
  >
    {children}
  </article>
);

export default AccessoryOptionWrapper;
