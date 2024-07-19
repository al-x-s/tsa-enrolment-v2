import React from "react";
import clsx from "clsx";

const ProgramOptionWrapper = ({
  program_status,

  isSelected,
  children,
}: {
  program_status: string;

  isSelected: boolean;
  children: React.ReactNode;
}) => {
  return (
    <article
      className={clsx(
        "border-4 rounded-lg mb-4",
        program_status === "Inactive" ? "bg-[#B0AFAF]" : "bg-[#E6D3F9]",
        isSelected ? "border-[#F6BD60]" : "border-[#979797]"
      )}
    >
      {children}
    </article>
  );
};

export default ProgramOptionWrapper;
